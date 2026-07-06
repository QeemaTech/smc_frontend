// Custom hook to switch between real API and mock API
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productsAPI,
  newsAPI,
  usersAPI,
  contactsAPI,
  complaintsAPI,
  bannersAPI,
  mediaAPI,
  statisticsAPI,
  tendersAPI,
  membersAPI,
  clientsAPI,
  productCategoriesAPI,
  financialAPI,
  chatAPI,
} from "@/services/api";
import { mockApi } from "@/services/mockApi";
import type {
  Product,
  News,
  User,
  Contact,
  Complaint,
  HeroBanner,
  Tender,
  TenderSubmission,
  Member,
  Client,
  ProductCategory,
  ChatMessage,
  FinancialRevenue,
  FinancialProduction,
  FinancialExport,
} from "@/services/api";

// Use real API by default - set VITE_USE_MOCK_API=true in .env to use mock API
// For production, always use real API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true"; // Default to false (use real API)

// Products Hooks
export const useProducts = () => {
  // Generate unique query key with timestamp to force fresh fetch
  const sessionTimestamp =
    typeof window !== "undefined"
      ? sessionStorage.getItem("page_load_time") || Date.now().toString()
      : Date.now().toString();

  if (
    typeof window !== "undefined" &&
    !sessionStorage.getItem("page_load_time")
  ) {
    sessionStorage.setItem("page_load_time", sessionTimestamp);
  }

  return useQuery({
    queryKey: ["products", sessionTimestamp], // Add timestamp to force new query on each page load
    queryFn: async () => {
      // Force fresh fetch every time - no caching
      // Add small delay to ensure CDN doesn't cache
      if (!USE_MOCK_API) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      const result = USE_MOCK_API
        ? mockApi.products.getAll()
        : productsAPI.getAll();
      return result;
    },
    staleTime: 0, // Data is immediately stale, will refetch on mount
    gcTime: 0, // Don't cache in memory (formerly cacheTime) - set to 0 to disable cache completely
    refetchOnMount: "always", // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchInterval: false, // Don't auto-refetch, but allow manual refetch
    networkMode: "online", // Only fetch when online
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () =>
      USE_MOCK_API ? mockApi.products.getById(id) : productsAPI.getById(id),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ product, imageFile }: { product: Omit<Product, "id">; imageFile?: File }) =>
      USE_MOCK_API
        ? mockApi.products.create(product)
        : productsAPI.create(product, imageFile),
    onSuccess: async (newProduct) => {
      // Increment API version to force CDN refresh on Vercel
      if (typeof window !== "undefined") {
        const currentVersion = parseInt(
          localStorage.getItem("api_version") || "1",
          10
        );
        localStorage.setItem("api_version", (currentVersion + 1).toString());
      }
      // Remove ALL product queries from cache
      queryClient.removeQueries({ queryKey: ["products"], exact: false });
      // Invalidate all product queries
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
      // Force refetch all product queries with new timestamp
      await queryClient.refetchQueries({
        queryKey: ["products"],
        exact: false,
      });
      // Clear and reset cache
      queryClient.resetQueries({ queryKey: ["products"], exact: false });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates, imageFile }: { id: number; updates: Partial<Product>; imageFile?: File }) =>
      USE_MOCK_API
        ? mockApi.products.update(id, updates)
        : productsAPI.update(id, updates, imageFile),
    onSuccess: async (updatedProduct, variables) => {
      // Increment API version to force CDN refresh on Vercel
      if (typeof window !== "undefined") {
        const currentVersion = parseInt(
          localStorage.getItem("api_version") || "1",
          10
        );
        localStorage.setItem("api_version", (currentVersion + 1).toString());
      }
      // Remove ALL product queries from cache
      queryClient.removeQueries({ queryKey: ["products"], exact: false });
      // Invalidate all product queries
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["products", variables.id],
      });
      // Force refetch all product queries
      await queryClient.refetchQueries({
        queryKey: ["products"],
        exact: false,
      });
      // Clear and reset cache
      queryClient.resetQueries({ queryKey: ["products"], exact: false });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.products.delete(id) : productsAPI.delete(id),
    onSuccess: async (_, deletedId) => {
      // Increment API version to force CDN refresh on Vercel
      if (typeof window !== "undefined") {
        const currentVersion = parseInt(
          localStorage.getItem("api_version") || "1",
          10
        );
        localStorage.setItem("api_version", (currentVersion + 1).toString());
      }
      // Remove ALL product queries from cache
      queryClient.removeQueries({ queryKey: ["products"], exact: false });
      // Invalidate all product queries
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
      // Force refetch all product queries
      await queryClient.refetchQueries({
        queryKey: ["products"],
        exact: false,
      });
      // Clear and reset cache
      queryClient.resetQueries({ queryKey: ["products"], exact: false });
    },
  });
};

// News Hooks
export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => (USE_MOCK_API ? mockApi.news.getAll() : newsAPI.getAll()),
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ news, imageFile }: { news: Omit<News, "id">; imageFile?: File }) =>
      USE_MOCK_API ? mockApi.news.create(news) : newsAPI.create(news, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates, imageFile }: { id: number; updates: Partial<News>; imageFile?: File }) =>
      USE_MOCK_API
        ? mockApi.news.update(id, updates)
        : newsAPI.update(id, updates, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.news.delete(id) : newsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// Users Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => (USE_MOCK_API ? mockApi.users.getAll() : usersAPI.getAll()),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: Omit<User, "id">) =>
      USE_MOCK_API ? mockApi.users.create(user) : usersAPI.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<User> }) =>
      USE_MOCK_API
        ? mockApi.users.update(id, updates)
        : usersAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.users.delete(id) : usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Contacts Hooks
export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: () =>
      USE_MOCK_API ? mockApi.contacts.getAll() : contactsAPI.getAll(),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contact: Omit<Contact, "id" | "date" | "status">) =>
      USE_MOCK_API
        ? Promise.resolve({ id: Date.now(), status: "new", date: new Date().toISOString(), ...contact } as Contact)
        : contactsAPI.create(contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Contact> }) =>
      USE_MOCK_API
        ? mockApi.contacts.update(id, updates)
        : contactsAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

// Complaints Hooks
export const useComplaints = () => {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: () =>
      USE_MOCK_API ? mockApi.complaints.getAll() : complaintsAPI.getAll(),
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (complaint: Omit<Complaint, "id" | "date" | "status">) =>
      USE_MOCK_API
        ? Promise.resolve({ id: Date.now(), status: "pending", date: new Date().toISOString(), ...complaint } as Complaint)
        : complaintsAPI.create(complaint),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Complaint>;
    }) =>
      USE_MOCK_API
        ? mockApi.complaints.update(id, updates)
        : complaintsAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
};

// Financial Hooks
export const useFinancialRevenue = () => {
  return useQuery({
    queryKey: ["financial", "revenue"],
    queryFn: () => financialAPI.revenue.getAll(),
  });
};

export const useCreateFinancialRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (record: Omit<FinancialRevenue, "id">) =>
      financialAPI.revenue.create(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "revenue"] });
    },
  });
};

export const useUpdateFinancialRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<FinancialRevenue> }) =>
      financialAPI.revenue.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "revenue"] });
    },
  });
};

export const useDeleteFinancialRevenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => financialAPI.revenue.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "revenue"] });
    },
  });
};

export const useFinancialProduction = () => {
  return useQuery({
    queryKey: ["financial", "production"],
    queryFn: () => financialAPI.production.getAll(),
  });
};

export const useCreateFinancialProduction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (record: Omit<FinancialProduction, "id">) =>
      financialAPI.production.create(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "production"] });
    },
  });
};

export const useUpdateFinancialProduction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<FinancialProduction> }) =>
      financialAPI.production.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "production"] });
    },
  });
};

export const useDeleteFinancialProduction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => financialAPI.production.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "production"] });
    },
  });
};

export const useFinancialExport = () => {
  return useQuery({
    queryKey: ["financial", "export"],
    queryFn: () => financialAPI.export.getAll(),
  });
};

export const useCreateFinancialExport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (record: Omit<FinancialExport, "id">) =>
      financialAPI.export.create(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "export"] });
    },
  });
};

export const useUpdateFinancialExport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<FinancialExport> }) =>
      financialAPI.export.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "export"] });
    },
  });
};

export const useDeleteFinancialExport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => financialAPI.export.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial", "export"] });
    },
  });
};

// Chat Hooks
export const useChatMessages = () => {
  return useQuery({
    queryKey: ["chat"],
    queryFn: () => chatAPI.getAll(),
  });
};

export const useCreateChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: Pick<ChatMessage, "name" | "email" | "message">) =>
      chatAPI.create(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
};

export const useUpdateChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<ChatMessage> }) =>
      chatAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
};

// Banners Hooks
export const useBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () =>
      USE_MOCK_API ? mockApi.banners.getAll() : bannersAPI.getAll(),
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      banner,
      imageFile,
    }: {
      banner: Omit<HeroBanner, "id">;
      imageFile?: File;
    }) =>
      USE_MOCK_API
        ? mockApi.banners.create(banner)
        : bannersAPI.create(banner, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
      imageFile,
    }: {
      id: number;
      updates: Partial<HeroBanner>;
      imageFile?: File;
    }) =>
      USE_MOCK_API
        ? mockApi.banners.update(id, updates)
        : bannersAPI.update(id, updates, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.banners.delete(id) : bannersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });
};

// Media Hooks
export const useMedia = () => {
  return useQuery({
    queryKey: ["media"],
    queryFn: () => (USE_MOCK_API ? mockApi.media.getAll() : mediaAPI.getAll()),
    retry: 1, // Only retry once to prevent infinite loops
    retryDelay: 1000, // Wait 1 second before retry
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      USE_MOCK_API ? mockApi.media.upload(file) : mediaAPI.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      USE_MOCK_API ? Promise.resolve() : mediaAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

// Statistics Hooks
export const useStatistics = () => {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: () =>
      USE_MOCK_API
        ? mockApi.statistics.getOverview()
        : statisticsAPI.getOverview(),
    // Avoid aggressive refetching on dashboards; cache briefly
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useMonthlyData = () => {
  return useQuery({
    queryKey: ["statistics", "monthly"],
    queryFn: () =>
      USE_MOCK_API
        ? mockApi.statistics.getMonthlyData()
        : statisticsAPI.getMonthlyData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useProductViews = () => {
  return useQuery({
    queryKey: ["statistics", "product-views"],
    queryFn: () =>
      USE_MOCK_API
        ? mockApi.statistics.getProductViews()
        : statisticsAPI.getProductViews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
  });
};

// Tenders Hooks
export const useTenders = () => {
  return useQuery({
    queryKey: ["tenders"],
    queryFn: () =>
      USE_MOCK_API ? mockApi.tenders.getAll() : tendersAPI.getAll(),
  });
};

export const useTender = (id: number) => {
  return useQuery({
    queryKey: ["tenders", id],
    queryFn: () =>
      USE_MOCK_API ? mockApi.tenders.getById(id) : tendersAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tender: Omit<Tender, "id" | "createdAt" | "submissions">) =>
      USE_MOCK_API ? mockApi.tenders.create(tender) : tendersAPI.create(tender),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const useUpdateTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Tender> }) =>
      USE_MOCK_API
        ? mockApi.tenders.update(id, updates)
        : tendersAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const useDeleteTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.tenders.delete(id) : tendersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
    },
  });
};

export const useSubmitTender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenderId,
      submission,
    }: {
      tenderId: number;
      submission: Omit<TenderSubmission, "id" | "submittedAt" | "status">;
    }) =>
      USE_MOCK_API
        ? mockApi.tenders.submit(tenderId, submission)
        : tendersAPI.submit(tenderId, submission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
      queryClient.invalidateQueries({
        queryKey: ["tenders", variables.tenderId, "submissions"],
      });
      queryClient.invalidateQueries({ queryKey: ["tenders", variables.tenderId] });
    },
  });
};

export const useTenderSubmissions = (tenderId: number) => {
  return useQuery({
    queryKey: ["tenders", tenderId, "submissions"],
    queryFn: () =>
      USE_MOCK_API
        ? mockApi.tenders.getSubmissions(tenderId)
        : tendersAPI.getSubmissions(tenderId),
    enabled: !!tenderId,
  });
};

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenderId,
      submissionId,
      status,
    }: {
      tenderId: number;
      submissionId: number;
      status: TenderSubmission["status"];
    }) =>
      USE_MOCK_API
        ? mockApi.tenders.updateSubmissionStatus(tenderId, submissionId, status)
        : tendersAPI.updateSubmissionStatus(tenderId, submissionId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenders", variables.tenderId, "submissions"],
      });
      queryClient.invalidateQueries({ queryKey: ["tenders"] });
      queryClient.invalidateQueries({ queryKey: ["tenders", variables.tenderId] });
    },
  });
};

// Members Hooks
export const useMembers = (includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ["members", includeInactive ? "all" : "active"],
    queryFn: () =>
      USE_MOCK_API
        ? mockApi.members.getAll()
        : membersAPI.getAllWithStatus(includeInactive ? "all" : "active"),
  });
};

export const useMember = (id: number) => {
  return useQuery({
    queryKey: ["members", id],
    queryFn: () =>
      USE_MOCK_API ? mockApi.members.getById(id) : membersAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (member: Omit<Member, "id">) =>
      USE_MOCK_API ? mockApi.members.create(member) : membersAPI.create(member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Member> }) =>
      USE_MOCK_API
        ? mockApi.members.update(id, updates)
        : membersAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? mockApi.members.delete(id) : membersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

// Product Categories Hooks
export const useProductCategories = (includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ["product-categories", includeInactive ? "all" : "active"],
    queryFn: () =>
      USE_MOCK_API
        ? mockApi.productCategories.getAll()
        : productCategoriesAPI.getAllWithStatus(includeInactive ? "all" : "active"),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Omit<ProductCategory, "id">) =>
      USE_MOCK_API
        ? mockApi.productCategories.create(category)
        : productCategoriesAPI.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
};

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<ProductCategory>;
    }) =>
      USE_MOCK_API
        ? mockApi.productCategories.update(id, updates)
        : productCategoriesAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
};

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API
        ? mockApi.productCategories.delete(id)
        : productCategoriesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Clients Hooks
export const useClients = (includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ["clients", includeInactive],
    queryFn: () =>
      USE_MOCK_API
        ? Promise.resolve([])
        : clientsAPI.getAllWithStatus(includeInactive ? "all" : "active"),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0, // Don't cache at all
    retry: 1, // Only retry once to prevent infinite loops
  });
};

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => (USE_MOCK_API ? null : clientsAPI.getById(id)),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: Omit<Client, "id">) =>
      USE_MOCK_API
        ? Promise.resolve({ id: 1, ...client } as Client)
        : clientsAPI.create(client),
    onSuccess: async (newClient) => {
      console.log("Client created successfully:", newClient);
      // Update cache for both includeInactive=true and includeInactive=false
      queryClient.setQueriesData(
        { queryKey: ["clients"] },
        (oldData: Client[] | undefined) => {
          console.log("Updating cache with new client. Old data:", oldData);
          if (!oldData) {
            console.log("No old data, returning new client array");
            return [newClient];
          }
          const updated = [...oldData, newClient];
          console.log("Updated data:", updated);
          return updated;
        }
      );
      // Invalidate and refetch to ensure consistency
      await queryClient.invalidateQueries({
        queryKey: ["clients"],
        exact: false,
      });
      await queryClient.refetchQueries({ queryKey: ["clients"], exact: false });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Client> }) =>
      USE_MOCK_API
        ? Promise.resolve({ id, ...updates } as Client)
        : clientsAPI.update(id, updates),
    onSuccess: async (updatedClient) => {
      console.log("Client updated successfully:", updatedClient);
      // Invalidate all client queries first
      await queryClient.invalidateQueries({
        queryKey: ["clients"],
        exact: false,
      });
      // Then refetch all client queries
      await queryClient.refetchQueries({ queryKey: ["clients"], exact: false });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      USE_MOCK_API ? Promise.resolve() : clientsAPI.delete(id),
    onSuccess: async (_, deletedId) => {
      console.log("Client deleted successfully:", deletedId);
      // Invalidate all client queries first
      await queryClient.invalidateQueries({
        queryKey: ["clients"],
        exact: false,
      });
      // Then refetch all client queries
      await queryClient.refetchQueries({ queryKey: ["clients"], exact: false });
    },
  });
};
