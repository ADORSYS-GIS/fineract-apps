import { useQuery } from "@tanstack/react-query";
/**
 * Maps OIDC user profile claims to the application's Customer type.
 */
import { UserProfile } from "oidc-client-ts";
import { useAuth } from "react-oidc-context";
import { Customer } from "@/types/customer";

function mapProfileToCustomer(
	profile: UserProfile & {
		fineract_client_id?: string;
		phone_number?: string;
	},
): Customer {
	return {
		id: profile.fineract_client_id || "",
		displayName: profile.name || "",
		email: profile.email || "",
		phone: profile.phone_number || "",
		status: "active", // An authenticated user is considered active
	};
}

/**
 * Hook to get the authenticated customer's details.
 *
 * This hook now sources customer data directly from the OIDC token's
 * claims, avoiding a separate API call. It provides a consistent
 * `Customer` object to the rest of the application.
 */
export function useCustomer() {
	const auth = useAuth();
	const profile = auth.user?.profile;

	return useQuery({
		queryKey: ["customer", profile?.fineract_external_id],
		queryFn: () => {
			if (!profile) {
				throw new Error("Not authenticated or profile not available");
			}
			return mapProfileToCustomer(profile);
		},
		enabled: !!profile,
		staleTime: Infinity, // Data comes from the token, it's fresh until token refresh
		gcTime: Infinity,
	});
}
