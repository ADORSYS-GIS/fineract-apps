import { Link } from '@tanstack/react-router';
import { SearchBar} from '@fineract-apps/ui';
import { ClientSearchViewProps } from './ClientSearch.types';

export const ClientSearchView = ({
  query,
  onQueryChange,
  onSearch,
  searchResults,
  isSearching,
  searchError,
}: ClientSearchViewProps) => (
  <div className="p-2 md:p-4 text-center">
    <h1 className="text-xl md:text-2xl font-bold">Client Search</h1>
    <p className="text-sm md:text-base">
      Enter a client's name to find their account details.
    </p>
    <div className="my-4 max-w-md mx-auto">
      <SearchBar
        value={query}
        onValueChange={onQueryChange}
        onSearch={onSearch}
      />
    </div>
    <div className="mt-8 text-left max-w-6xl mx-auto">
      <h2 className="text-lg md:text-xl font-semibold">Search Results</h2>
      {isSearching && <p>Searching...</p>}
      {searchError && (
        <p className="text-red-500">
          Error searching for clients: {searchError.message}
        </p>
      )}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">External Id</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {searchResults.map((client) => (
              <tr key={client.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to="/clients/$clientId"
                    params={{ clientId: String(client.id) }}
                    className="text-blue-600 hover:underline"
                  >
                    {client.displayName}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{client.accountNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.externalId as unknown as string}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.status?.value}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.officeName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);