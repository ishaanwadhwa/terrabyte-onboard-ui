import { useEffect, useState } from "react";

interface CountryCode {
  code: string;
  label: string;
}

interface PhoneInputProps {
  countries?: CountryCode[];
  placeholder?: string;
  onChange?: (phoneNumber: string) => void;
  selectPosition?: "start" | "end"; // New prop for dropdown position
  value?: string; // Controlled value from parent
}

const defaultCountries: CountryCode[] = [
  { code: "US", label: "+1" },
  { code: "IN", label: "+91" },
  { code: "GB", label: "+44" },
  { code: "AU", label: "+61" },
  { code: "CA", label: "+1" },
];

function ensurePlusPrefix(value: string): string {
  const trimmed = (value || "").toString().trim();
  if (!trimmed) return "";
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  placeholder = "+1 (555) 000-0000",
  onChange,
  selectPosition = "start", // Default position is 'start'
  value,
}) => {
  // Working list (prop → API → fallback)
  const [availableCountries, setAvailableCountries] = useState<CountryCode[]>(countries || defaultCountries);
  const [selectedCountry, setSelectedCountry] = useState<string>((countries || defaultCountries)[0]?.code || "US");
  const [phoneNumber, setPhoneNumber] = useState<string>((countries || defaultCountries)[0]?.label || "+1");

  // Load from local JSON first; fallback to country.io if no explicit prop supplied
  useEffect(() => {
    if (countries && countries.length > 0) return; // caller provided list
    (async () => {
      try {
        // Try local file under public/
        let res = await fetch("/phone-codes.json", { cache: "no-store" });
        let data: Record<string, string> | null = null;
        if (res.ok) {
          data = (await res.json()) as Record<string, string>;
        } else {
          // Fallback to remote API
          res = await fetch("https://country.io/phone.json");
          if (res.ok) {
            data = (await res.json()) as Record<string, string>;
          }
        }
        if (!data) throw new Error("Failed to load country codes");
        const list: CountryCode[] = Object.entries(data)
          .filter(([code]) => !!code)
          .map(([code, dial]) => ({ code, label: ensurePlusPrefix(dial) }))
          .sort((a, b) => a.code.localeCompare(b.code));
        if (list.length) {
          setAvailableCountries(list);
          const defaultCode = list.find(c => c.code === "US")?.code || list[0].code;
          const defaultDial = list.find(c => c.code === defaultCode)?.label || list[0].label;
          setSelectedCountry(defaultCode);
          setPhoneNumber(defaultDial);
        }
      } catch (_err) {
        // Silently fall back to defaults
        setAvailableCountries(defaultCountries);
        setSelectedCountry(defaultCountries[0].code);
        setPhoneNumber(defaultCountries[0].label);
      }
    })();
  }, [countries]);

  const countryCodes: Record<string, string> = (availableCountries || []).reduce(
    (acc, { code, label }) => ({ ...acc, [code]: label }),
    {}
  );

  // If parent provides a value, keep the input in sync and try to infer country by dial prefix
  useEffect(() => {
    if (typeof value === "string") {
      const next = value.trim();
      setPhoneNumber(next);
      const withPlus = ensurePlusPrefix(next);
      // Find the longest dial code prefix match
      const sortedByDialLen = [...availableCountries].sort((a, b) => b.label.length - a.label.length);
      const match = sortedByDialLen.find((c) => withPlus.startsWith(ensurePlusPrefix(c.label)));
      if (match) setSelectedCountry(match.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, availableCountries]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setPhoneNumber(countryCodes[newCountry]);
    if (onChange) {
      onChange(countryCodes[newCountry]);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  return (
    <div className="relative flex">
      {/* Dropdown position: Start */}
      {selectPosition === "start" && (
        <div className="absolute">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="appearance-none bg-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
          >
            {availableCountries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none bg-none right-3 dark:text-gray-400">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Input field */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={`dark:bg-dark-900 h-11 w-full ${
          selectPosition === "start" ? "pl-[84px]" : "pr-[84px]"
        } rounded-lg border border-gray-300 bg-transparent py-3 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
      />

      {/* Dropdown position: End */}
      {selectPosition === "end" && (
        <div className="absolute right-0">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="appearance-none bg-none rounded-r-lg border-0 border-l border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
          >
            {availableCountries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
