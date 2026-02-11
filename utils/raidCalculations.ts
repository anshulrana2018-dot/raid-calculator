import { RaidConfig, RaidCalculationResult, RAID_DATA } from '../types';

const convertToTB = (size: number, unit: 'TB' | 'GB' | 'MB'): number => {
  if (unit === 'TB') return size;
  if (unit === 'GB') return size / 1000;
  if (unit === 'MB') return size / 1000000;
  return size;
};

const formatSize = (tb: number): string => {
  if (tb >= 1) return `${tb.toFixed(2)} TB`;
  if (tb >= 0.001) return `${(tb * 1000).toFixed(0)} GB`;
  return `${(tb * 1000000).toFixed(0)} MB`;
};

export const calculateRaid = (config: RaidConfig): RaidCalculationResult => {
  const { level, diskCount, diskSize, diskSizeUnit } = config;
  const singleDiskTB = convertToTB(diskSize, diskSizeUnit);
  const totalCapacity = singleDiskTB * diskCount;

  let usableTB = 0;
  let protectionTB = 0;
  let unusedTB = 0;
  let faultTolerance = '';
  let readSpeed = '';
  let writeSpeed = '';

  const meta = RAID_DATA[level];

  // Basic validation fallback
  if (diskCount < meta.minDrives) {
      return {
          usable: 0,
          protection: 0,
          unused: totalCapacity,
          readableUsable: '0 TB',
          readableProtection: '0 TB',
          readableUnused: formatSize(totalCapacity),
          faultTolerance: 'N/A',
          readSpeed: 'N/A',
          writeSpeed: 'N/A',
          efficiency: 0,
          minDrives: meta.minDrives
      }
  }

  switch (level) {
    case 'RAID 0':
      usableTB = totalCapacity;
      protectionTB = 0;
      faultTolerance = 'None';
      readSpeed = `${diskCount}x`;
      writeSpeed = `${diskCount}x`;
      break;
    case 'RAID 1':
      // Assuming standard RAID 1 mirrors all drives to the size of one
      // Or pairs? Usually RAID 1 with N drives means N copies of same data.
      usableTB = singleDiskTB;
      protectionTB = totalCapacity - usableTB;
      faultTolerance = `${diskCount - 1} drives`;
      readSpeed = `${diskCount}x`;
      writeSpeed = `1x`;
      break;
    case 'RAID 5':
      usableTB = (diskCount - 1) * singleDiskTB;
      protectionTB = singleDiskTB;
      faultTolerance = '1 drive';
      readSpeed = `${diskCount - 1}x`;
      writeSpeed = 'Slow (Parity Calc)';
      break;
    case 'RAID 6':
      usableTB = (diskCount - 2) * singleDiskTB;
      protectionTB = 2 * singleDiskTB;
      faultTolerance = '2 drives';
      readSpeed = `${diskCount - 2}x`;
      writeSpeed = 'Very Slow (Double Parity)';
      break;
    case 'RAID 10':
      // Nested RAID 1+0. 
      // Usable is N/2.
      usableTB = (diskCount / 2) * singleDiskTB;
      protectionTB = usableTB;
      faultTolerance = 'Up to 1 per pair';
      readSpeed = `${diskCount}x`;
      writeSpeed = `${diskCount / 2}x`;
      break;
    case 'RAID 50':
      // Assumes minimum groups. Usually spans of RAID 5.
      // E.g. 6 drives = 2 groups of 3. (3-1) + (3-1) = 4 data drives.
      // S = diskCount / 3 (simplified for basic calculator assumption, usually configurable)
      // Let's assume groups of 3 drives for max efficiency unless N is not divisible by 3, then try 4, etc.
      // For this calc, let's use a standard assumption: 2 groups if N >= 6.
      const groups50 = 2; // simplified
      usableTB = (diskCount - groups50) * singleDiskTB;
      protectionTB = groups50 * singleDiskTB;
      faultTolerance = '1 drive per group';
      readSpeed = 'High';
      writeSpeed = 'Medium';
      break;
    case 'RAID 60':
        // Similar logic, min 8 drives. 2 groups of 4.
        const groups60 = 2;
        usableTB = (diskCount - (2 * groups60)) * singleDiskTB;
        protectionTB = (2 * groups60) * singleDiskTB;
        faultTolerance = '2 drives per group';
        readSpeed = 'High';
        writeSpeed = 'Low';
        break;
    default:
      break;
  }

  // Sanity check for negative calc if non-standard drive counts
  if (usableTB < 0) usableTB = 0;
  if (protectionTB < 0) protectionTB = 0;

  unusedTB = totalCapacity - usableTB - protectionTB;
  if (unusedTB < 0) unusedTB = 0;

  const efficiency = totalCapacity > 0 ? (usableTB / totalCapacity) * 100 : 0;

  return {
    usable: usableTB,
    protection: protectionTB,
    unused: unusedTB,
    readableUsable: formatSize(usableTB),
    readableProtection: formatSize(protectionTB),
    readableUnused: formatSize(unusedTB),
    faultTolerance,
    readSpeed,
    writeSpeed,
    efficiency,
    minDrives: meta.minDrives
  };
};
