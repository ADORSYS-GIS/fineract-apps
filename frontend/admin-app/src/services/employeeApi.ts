import { Employee } from "./types";

const BASE_URL = import.meta.env.VITE_FINERACT_API_URL;
const TENANT_ID = import.meta.env.VITE_FINERACT_TENANT_ID;

const EMPLOYEE_API_BASE = `${BASE_URL}/v1/adorsys/employees`;

const getAuthHeaders = (isGetRequest = false) => {
	const username = import.meta.env.VITE_FINERACT_USERNAME;
	const password = import.meta.env.VITE_FINERACT_PASSWORD;
	const basicAuth = btoa(`${username}:${password}`);
	const headers: HeadersInit = {
		"Fineract-Platform-TenantId": TENANT_ID,
		Authorization: `Basic ${basicAuth}`,
	};
	if (!isGetRequest) {
		headers["Content-Type"] = "application/json";
	}
	return headers;
};

/**
 * Generic API Response for Employee operations
 */
export interface EmployeeApiResponse {
	resourceId?: number;
	[key: string]: unknown; // Allow other properties
}

/**
 * Payload for creating a new Employee
 */
export interface CreateEmployeePayload {
	officeId: number;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	roles: number[];
	isLoanOfficer: boolean;
	mobileNo?: string;
	externalId?: string;
	joiningDate?: string; // e.g., "01 January 2024"
}

/**
 * Payload for updating an existing Employee
 */
export interface UpdateEmployeePayload {
	isLoanOfficer: boolean;
	mobileNo?: string;
	firstname?: string;
	lastname?: string;
	roles?: number[];
	officeId?: number;
}

/**
 * Creates a new employee.
 * This single operation creates both a Staff and an AppUser entity in Fineract.
 *
 * @param employeeData - The employee data for creation
 * @returns Promise with the result of the creation operation
 */
export async function createEmployee(
	employeeData: CreateEmployeePayload,
): Promise<EmployeeApiResponse> {
	const response = await fetch(EMPLOYEE_API_BASE, {
		method: "POST",
		headers: getAuthHeaders(),
		credentials: "include", // Include OIDC session cookies
		body: JSON.stringify(employeeData),
	});

	if (!response.ok) {
		const error = await response.json();
		throw error;
	}

	return response.json();
}

/**
 * Retrieves all employees.
 *
 * @returns Promise with an array of all employees
 */
export async function getEmployees(): Promise<Employee[]> {
	const response = await fetch(EMPLOYEE_API_BASE, {
		method: "GET",
		headers: getAuthHeaders(true),
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json();
		throw error;
	}

	const data = await response.json();
	if (Array.isArray(data)) {
		return data;
	}
	return data;
}

/**
 * Retrieves a single employee's details.
 *
 * @param userId - The ID of the employee to retrieve
 * @returns Promise with the employee's data
 */
export async function getEmployee(userId: number): Promise<Employee> {
	const response = await fetch(`${EMPLOYEE_API_BASE}/${userId}`, {
		method: "GET",
		headers: getAuthHeaders(true),
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json();
		throw error;
	}

	const data: Employee = await response.json();
	return data;
}

/**
 * Updates an existing employee.
 *
 * @param userId - The ID of the employee to update
 * @param employeeData - The fields to update
 * @returns Promise with the result of the update operation
 */
export async function updateEmployee(
	userId: number,
	employeeData: UpdateEmployeePayload,
): Promise<EmployeeApiResponse> {
	const response = await fetch(`${EMPLOYEE_API_BASE}/${userId}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		credentials: "include",
		body: JSON.stringify(employeeData),
	});

	if (!response.ok) {
		const error = await response.json();
		throw error;
	}

	return response.json();
}
