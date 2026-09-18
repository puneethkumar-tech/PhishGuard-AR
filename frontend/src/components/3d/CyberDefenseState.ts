import { ThreatLevel } from '@/types';

export type DefenseState = 'IDLE' | 'SCANNING' | 'THREAT_DETECTED' | 'DEFENDING' | 'PROTECTED';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ThreatNode3D {
  id: string;
  position: [number, number, number];
  lat: number;
  lng: number;
  label: string;
  type: string;
  severity: SeverityLevel;
  threatLevel: ThreatLevel;
  region: string;
  vector: string;
  timestamp: string;
  intensity: number;
  status: 'SIMULATED' | 'CONTAINED' | 'ACTIVE';
}

export const ADVANCED_THREAT_NODES: ThreatNode3D[] = [
  {
    id: 'node-sf',
    position: [1.32, 0.58, 0.76],
    lat: 37.7749,
    lng: -122.4194,
    label: 'San Francisco Gateway',
    type: 'Credential Phishing Portal',
    severity: 'HIGH',
    threatLevel: 'phishing',
    region: 'North America (US-West)',
    vector: 'Spoofed OAuth Consent Screen',
    timestamp: '2 mins ago',
    intensity: 0.88,
    status: 'ACTIVE',
  },
  {
    id: 'node-london',
    position: [-1.22, 0.82, 0.68],
    lat: 51.5074,
    lng: -0.1278,
    label: 'London Exchange Relay',
    type: 'Cyrillic Homoglyph Evasion',
    severity: 'CRITICAL',
    threatLevel: 'adversarial',
    region: 'Europe (EU-West)',
    vector: 'Unicode Confusable: pаypаl-auth.com',
    timestamp: '4 mins ago',
    intensity: 0.98,
    status: 'ACTIVE',
  },
  {
    id: 'node-sg',
    position: [0.78, -0.88, 1.12],
    lat: 1.3521,
    lng: 103.8198,
    label: 'Singapore Financial Hub',
    type: 'Spear Phishing Wire Lure',
    severity: 'HIGH',
    threatLevel: 'phishing',
    region: 'Asia-Pacific (APAC)',
    vector: 'Executive Impersonation BEC',
    timestamp: '7 mins ago',
    intensity: 0.82,
    status: 'ACTIVE',
  },
  {
    id: 'node-syd',
    position: [-0.88, -0.62, -1.22],
    lat: -33.8688,
    lng: 151.2093,
    label: 'Sydney Telemetry Node',
    type: 'Suspicious QR-Code Redirect',
    severity: 'MEDIUM',
    threatLevel: 'suspicious',
    region: 'Oceania (AU-East)',
    vector: 'Quishing / Obfuscated Bitly URI',
    timestamp: '11 mins ago',
    intensity: 0.65,
    status: 'ACTIVE',
  },
  {
    id: 'node-berlin',
    position: [0.28, 1.38, -0.72],
    lat: 52.52,
    lng: 13.405,
    label: 'Berlin Security Proxy',
    type: 'Zero-Width Space Keyword Split',
    severity: 'CRITICAL',
    threatLevel: 'adversarial',
    region: 'Europe (EU-Central)',
    vector: 'Invisible Character Token Split',
    timestamp: '14 mins ago',
    intensity: 0.94,
    status: 'ACTIVE',
  },
  {
    id: 'node-sp',
    position: [-1.38, -0.28, 0.58],
    lat: -23.5505,
    lng: -46.6333,
    label: 'São Paulo Data Center',
    type: 'Verified Benign Mail Traffic',
    severity: 'LOW',
    threatLevel: 'safe',
    region: 'South America (SA-East)',
    vector: 'Valid DKIM/SPF Internal Exchange',
    timestamp: '18 mins ago',
    intensity: 0.35,
    status: 'CONTAINED',
  },
];
