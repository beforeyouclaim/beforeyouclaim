import JSON5 from 'json5';

export const countryMap = {
  Australia: { code: 'au', flag: '🇦🇺' },
  'New Zealand': { code: 'nz', flag: '🇳🇿' },
};

export const popularCompaniesMap = {
  Australia: [
    { name: 'AAMI', url: 'https://aami.com.au' },
    { name: 'Allianz', url: 'https://allianz.com.au' },
  ],
  'New Zealand': [
    { name: 'AA Insurance', url: 'https://www.aainsurance.co.nz' },
    { name: 'State Insurance', url: 'https://state.co.nz' },
  ],
};

export type CountryKey = keyof typeof countryMap;
export const validCountries = Object.keys(countryMap) as CountryKey[];

export type DocumentsOutput = {
  documents: InsurancePolicy[];
};

export type InsurancePolicy = {
  Country: string;
  Company: string;
  PDF: string;
  Type: string;
  Summary: {
    covered: string;
    'not-covered': string;
    'additional-info': string;
    gotchas: string;
  };
};

export const parseInsuranceDocument = (rawData: any): InsurancePolicy => {
  if (typeof rawData !== 'object' || rawData === null) {
    throw new Error(
      'Invalid input: expected an object, received ' + typeof rawData
    );
  }

  const { Country, Company, PDF, Type, Summary } = rawData;

  const validateString = (field: string, value: any) => {
    if (typeof value !== 'string') {
      throw new Error(
        `Invalid ${field}: expected string, received ${typeof value}`
      );
    }
  };

  try {
    validateString('Country', Country);
    validateString('Company', Company);
    validateString('PDF', PDF);
    validateString('Type', Type);
    validateString('Summary', Summary);
  } catch (e) {
    throw new Error(`Property validation failed: ${(e as Error).message}`);
  }

  let parsedSummary: InsurancePolicy['Summary'];

  try {
    parsedSummary = JSON5.parse(Summary);
  } catch (e) {
    throw new Error(
      `Invalid Summary JSON for ${Company} ${Type}: ${(e as Error).message}`
    );
  }

  // Validate parsedSummary fields
  const validateSummaryField = (field: keyof InsurancePolicy['Summary']) => {
    if (typeof parsedSummary[field] !== 'string') {
      throw new Error(
        `Invalid Summary.${field}: expected string, received ${typeof parsedSummary[field]}`
      );
    }
  };

  try {
    validateSummaryField('covered');
    validateSummaryField('not-covered');
    validateSummaryField('additional-info');
    validateSummaryField('gotchas');
  } catch (e) {
    throw new Error(`Summary field validation failed: ${(e as Error).message}`);
  }

  return {
    Country,
    Company,
    PDF,
    Type,
    Summary: parsedSummary,
  };
};

export const parseDocuments = (rawData: any): InsurancePolicy[] => {
  const { documents } = rawData;

  if (!Array.isArray(documents)) {
    throw new Error('Invalid Documents: expected an array');
  }

  const parsedDocuments = documents.map((doc) => parseInsuranceDocument(doc));

  return parsedDocuments;
};
