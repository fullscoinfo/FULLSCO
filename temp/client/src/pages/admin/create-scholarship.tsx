import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/utils";
import Sidebar from "@/components/admin/sidebar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { insertScholarshipSchema, Country, Level, Category } from "@shared/schema";

// Extend the schema to make the slug field optional (it will be auto-generated)
const createScholarshipSchema = insertScholarshipSchema
  .extend({
    slug: z.string().optional(),
  })
  .refine(
    (data) => {
      // If country, level, and category IDs are provided, ensure they are numbers
      if (data.countryId) return typeof data.countryId === "number";
      if (data.levelId) return typeof data.levelId === "number";
      if (data.categoryId) return typeof data.categoryId === "number";
      return true;
    },
    {
      message: "IDs must be numbers",
      path: ["countryId"],
    }
  );

type CreateScholarshipFormValues = z.infer<typeof createScholarshipSchema>;

const CreateScholarship = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch reference data
  const { data: countries } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
    enabled: isAuthenticated,
  });

  const { data: levels } = useQuery<Level[]>({
    queryKey: ["/api/levels"],
    enabled: isAuthenticated,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  // Set up form
  const form = useForm<CreateScholarshipFormValues>({
    resolver: zodResolver(createScholarshipSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      amount: "",
      isFeatured: false,
      isFullyFunded: false,
      requirements: "",
      applicationLink: "",
      imageUrl: "",
    },
  });

  // Create scholarship mutation
  const createMutation = useMutation({
    mutationFn: async (values: CreateScholarshipFormValues) => {
      // Generate slug if not provided
      if (!values.slug) {
        values.slug = slugify(values.title);
      }

      // Convert string IDs to numbers
      if (values.countryId && typeof values.countryId === "string") {
        values.countryId = parseInt(values.countryId);
      }
      if (values.levelId && typeof values.levelId === "string") {
        values.levelId = parseInt(values.levelId);
      }
      if (values.categoryId && typeof values.categoryId === "string") {
        values.categoryId = parseInt(values.categoryId);
      }

      const response = await apiRequest("POST", "/api/scholarships", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Scholarship created",
        description: "The scholarship has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/scholarships"] });
      navigate("/admin/scholarships");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create scholarship: ${error}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CreateScholarshipFormValues) => {
    createMutation.mutate(values);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <div className="mb-6">
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => navigate("/admin/scholarships")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scholarships
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Scholarship
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scholarship Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Scholarship title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a descriptive title for the scholarship.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="countryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries?.map((country) => (
                                <SelectItem
                                  key={country.id}
                                  value={country.id.toString()}
                                >
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="levelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {levels?.map((level) => (
                                <SelectItem
                                  key={level.id}
                                  value={level.id.toString()}
                                >
                                  {level.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the scholarship"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Deadline</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., June 30, 2023" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the deadline for applications.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scholarship Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., $10,000/year" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Scholarship</FormLabel>
                            <FormDescription>
                              Featured scholarships appear prominently on the home page.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFullyFunded"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Fully Funded</FormLabel>
                            <FormDescription>
                              Mark this scholarship as fully funded.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Eligibility requirements and application criteria"
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          URL where students can apply for this scholarship.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          URL of an image representing this scholarship.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/admin/scholarships")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? "Creating..." : "Create Scholarship"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CreateScholarship;
