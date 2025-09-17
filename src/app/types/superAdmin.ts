export interface PackageSchema {
    id: number;
    name: string;
    price: number;
    duration: number;
    maxBranch: number;
    is_active: string;
}

export interface CountrySchema {
    id: number;
    name: string;
    code: string;
    phone_code: string;
    currency: string;
    is_active: boolean;
}

export interface StateSchema {
    id: number;
    name: string;
    country_id: number;
    is_active: boolean;
    country: CountrySchema;
}

export interface BasicStateSchema {
    id: number;
    name: string;
    country_id: number;
    is_active: boolean;
}

export interface CitySchema {
    id: number;
    name: string;
    state_id: number;
    country_id: number;
    is_active: boolean;
    state: BasicStateSchema;
    country: CountrySchema;
}

export interface CompanyFileSchema{
    id: number;

    file_name: string;
    is_active: boolean;
}