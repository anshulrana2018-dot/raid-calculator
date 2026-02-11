export type RaidLevel = 'RAID 0' | 'RAID 1' | 'RAID 5' | 'RAID 6' | 'RAID 10' | 'RAID 50' | 'RAID 60';

export interface RaidConfig {
  level: RaidLevel;
  diskCount: number;
  diskSize: number; // in TB
  diskSizeUnit: 'TB' | 'GB' | 'MB';
}

export interface RaidCalculationResult {
  usable: number;
  protection: number;
  unused: number;
  readableUsable: string;
  readableProtection: string;
  readableUnused: string;
  faultTolerance: string;
  readSpeed: string;
  writeSpeed: string;
  efficiency: number;
  minDrives: number;
}

export interface RaidMeta {
  id: RaidLevel;
  name: string;
  description: string;
  minDrives: number;
  faultToleranceDesc: string;
  pros: string[];
  cons: string[];
}

export const RAID_DATA: Record<RaidLevel, RaidMeta> = {
  'RAID 0': {
    id: 'RAID 0',
    name: 'RAID 0 (Striping)',
    description: 'Splits data evenly across two or more disks, without parity information, redundancy, or fault tolerance.',
    minDrives: 2,
    faultToleranceDesc: '0 drives. If one fails, all data is lost.',
    pros: ['Maximum speed', '100% storage efficiency'],
    cons: ['No fault tolerance', 'Higher failure risk'],
  },
  'RAID 1': {
    id: 'RAID 1',
    name: 'RAID 1 (Mirroring)',
    description: 'Consists of an exact copy (or mirror) of a set of data on two or more disks.',
    minDrives: 2,
    faultToleranceDesc: 'N-1 drives (as long as one copy remains).',
    pros: ['High read speed', 'Excellent redundancy'],
    cons: ['High storage cost (50% efficiency usually)', 'Slower write speed than RAID 0'],
  },
  'RAID 5': {
    id: 'RAID 5',
    name: 'RAID 5 (Striping with Parity)',
    description: 'Stripes both data and parity information across three or more drives.',
    minDrives: 3,
    faultToleranceDesc: '1 drive. Array can rebuild if one drive fails.',
    pros: ['Balanced performance', 'Good efficiency', '1 drive fault tolerance'],
    cons: ['Long rebuild times', 'Write penalty due to parity calculation'],
  },
  'RAID 6': {
    id: 'RAID 6',
    name: 'RAID 6 (Striping with Double Parity)',
    description: 'Similar to RAID 5, but includes a second parity block distributed across the drives.',
    minDrives: 4,
    faultToleranceDesc: '2 drives. Can withstand two simultaneous failures.',
    pros: ['High fault tolerance', 'Good read performance'],
    cons: ['Lower write performance', 'More expensive than RAID 5'],
  },
  'RAID 10': {
    id: 'RAID 10',
    name: 'RAID 10 (1+0)',
    description: 'Combines disk mirroring and disk striping to protect data.',
    minDrives: 4,
    faultToleranceDesc: 'Up to half the drives (depends on which ones fail).',
    pros: ['High performance', 'Fast rebuild'],
    cons: ['Expensive (50% efficiency)', 'Minimum 4 drives'],
  },
  'RAID 50': {
    id: 'RAID 50',
    name: 'RAID 50 (5+0)',
    description: 'Stripes data across multiple RAID 5 arrays.',
    minDrives: 6,
    faultToleranceDesc: '1 drive per sub-array.',
    pros: ['Better write performance than RAID 5', 'Good fault tolerance'],
    cons: ['Complex configuration', 'Requires many disks'],
  },
  'RAID 60': {
    id: 'RAID 60',
    name: 'RAID 60 (6+0)',
    description: 'Stripes data across multiple RAID 6 arrays.',
    minDrives: 8,
    faultToleranceDesc: '2 drives per sub-array.',
    pros: ['Extremely high fault tolerance'],
    cons: ['Lower storage efficiency', 'Expensive'],
  },
};
