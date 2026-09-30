import type { Vendor, Property, ServiceCategory, Trade } from '../types';

export interface VendorRecommendation {
  vendor: Vendor;
  score: number;
  reasons: string[];
  warnings: string[];
}

export interface VendorMatchResult {
  recommendations: VendorRecommendation[];
  noMatchReason?: string;
}

function categoryToTrade(category: ServiceCategory): Trade {
  if (category === 'hvac') return 'hvac';
  if (category === 'plumbing') return 'plumbing';
  if (category === 'electrical') return 'electrical';
  if (category === 'handyman') return 'handyman';
  if (category === 'appliance') return 'appliance';
  if (category === 'structural') return 'structural';
  if (category === 'roofing') return 'roofing';
  if (category === 'landscape') return 'landscape';
  if (category === 'pest_control') return 'pest_control';
  if (category === 'cleaning') return 'cleaning';
  if (category === 'painting') return 'painting';
  return 'general';
}

export function matchVendors(
  vendors: Vendor[],
  property: Property,
  category: ServiceCategory
): VendorMatchResult {
  const requiredTrade = categoryToTrade(category);
  const propertyZip = property.address.zip;

  const eligible: VendorRecommendation[] = [];

  for (const vendor of vendors) {
    const reasons: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    // Rule 1: Trade match
    const hasTrade = vendor.trades.includes(requiredTrade);
    if (!hasTrade) continue; // hard filter

    reasons.push(`Supports required trade: ${requiredTrade}`);
    score += 10;

    // Rule 2: Service area
    const inArea = vendor.serviceAreas.includes(propertyZip) ||
      vendor.serviceAreas.some((a) => a.toLowerCase() === property.address.city.toLowerCase());
    if (!inArea) continue; // hard filter
    reasons.push(`Service area includes ${propertyZip} (${property.address.city})`);
    score += 10;

    // Rule 3: Active status
    if (vendor.status === 'inactive') continue; // hard filter

    // Rule 4: Preferred vendor
    if (property.preferredVendorIds.includes(vendor.id)) {
      reasons.push('Listed as preferred vendor for this property');
      score += 20;
    }

    // Rule 5: Prior property work
    if (vendor.priorPropertyIds.includes(property.id)) {
      reasons.push('Has prior service history at this property');
      score += 15;
    }

    // Rule 6: Availability flags
    if (vendor.availabilityStatus === 'available') {
      reasons.push('Availability: currently available');
      score += 5;
    } else if (vendor.availabilityStatus === 'busy') {
      warnings.push('Vendor reported as currently busy — confirm availability');
      score -= 5;
    } else {
      warnings.push('Availability not confirmed — verify before scheduling');
    }

    // Insurance / license notes
    if (vendor.insuranceVerified) {
      reasons.push('Insurance verified on file');
    }

    eligible.push({ vendor, score, reasons, warnings });
  }

  if (eligible.length === 0) {
    return {
      recommendations: [],
      noMatchReason: `No active vendors found matching trade "${requiredTrade}" in service area ${propertyZip}. Coordinator review required.`,
    };
  }

  eligible.sort((a, b) => b.score - a.score);

  return { recommendations: eligible };
}
