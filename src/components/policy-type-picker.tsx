'use client';

import { useAtom, useAtomValue } from 'jotai';

import {
  availablePolicyTypesAtom,
  selectedCompanyAtom,
  selectedPolicyTypeAtom,
} from '@/lib/store';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PolicyTypePicker = () => {
  const selectedCompany = useAtomValue(selectedCompanyAtom);
  const availablePolicyTypes = useAtomValue(availablePolicyTypesAtom);
  const [selectedPolicyType, setSelectedPolicyType] = useAtom(
    selectedPolicyTypeAtom
  );

  if (!selectedCompany) return null;

  return (
    <div className="space-y-4">
      <Label className="sm:text-md text-sm font-semibold">
        Select Policy Type
      </Label>

      <Select value={selectedPolicyType} onValueChange={setSelectedPolicyType}>
        <SelectTrigger>
          <SelectValue placeholder="Select policy type" />
        </SelectTrigger>

        <SelectContent>
          {[...availablePolicyTypes]
            .sort((a, b) => a.localeCompare(b))
            .map((type) => (
              <SelectItem
                key={type}
                value={type}
                className="ml-0 text-xs sm:text-sm"
              >
                {type}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PolicyTypePicker;
