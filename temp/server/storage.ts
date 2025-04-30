import {
  users, User, InsertUser,
  categories, Category, InsertCategory,
  levels, Level, InsertLevel,
  countries, Country, InsertCountry,
  scholarships, Scholarship, InsertScholarship,
  posts, Post, InsertPost,
  tags, Tag, InsertTag,
  postTags, PostTag, InsertPostTag,
  successStories, SuccessStory, InsertSuccessStory,
  subscribers, Subscriber, InsertSubscriber,
  seoSettings, SeoSetting, InsertSeoSetting
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;

  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  listCategories(): Promise<Category[]>;

  // Level operations
  getLevel(id: number): Promise<Level | undefined>;
  getLevelBySlug(slug: string): Promise<Level | undefined>;
  createLevel(level: InsertLevel): Promise<Level>;
  listLevels(): Promise<Level[]>;

  // Country operations
  getCountry(id: number): Promise<Country | undefined>;
  getCountryBySlug(slug: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  listCountries(): Promise<Country[]>;

  // Scholarship operations
  getScholarship(id: number): Promise<Scholarship | undefined>;
  getScholarshipBySlug(slug: string): Promise<Scholarship | undefined>;
  createScholarship(scholarship: InsertScholarship): Promise<Scholarship>;
  updateScholarship(id: number, scholarship: Partial<InsertScholarship>): Promise<Scholarship | undefined>;
  deleteScholarship(id: number): Promise<boolean>;
  listScholarships(filters?: { isFeatured?: boolean, countryId?: number, levelId?: number, categoryId?: number }): Promise<Scholarship[]>;

  // Post operations
  getPost(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  incrementPostViews(id: number): Promise<boolean>;
  listPosts(filters?: { isFeatured?: boolean, authorId?: number }): Promise<Post[]>;

  // Tag operations
  getTag(id: number): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  listTags(): Promise<Tag[]>;

  // Post-Tag operations
  getPostTags(postId: number): Promise<Tag[]>;
  getTagPosts(tagId: number): Promise<Post[]>;
  addTagToPost(postId: number, tagId: number): Promise<PostTag>;
  removeTagFromPost(postId: number, tagId: number): Promise<boolean>;

  // Success Story operations
  getSuccessStory(id: number): Promise<SuccessStory | undefined>;
  getSuccessStoryBySlug(slug: string): Promise<SuccessStory | undefined>;
  createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory>;
  updateSuccessStory(id: number, story: Partial<InsertSuccessStory>): Promise<SuccessStory | undefined>;
  deleteSuccessStory(id: number): Promise<boolean>;
  listSuccessStories(): Promise<SuccessStory[]>;

  // Newsletter subscriber operations
  getSubscriber(id: number): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  listSubscribers(): Promise<Subscriber[]>;

  // SEO settings operations
  getSeoSetting(id: number): Promise<SeoSetting | undefined>;
  getSeoSettingByPath(pagePath: string): Promise<SeoSetting | undefined>;
  createSeoSetting(seoSetting: InsertSeoSetting): Promise<SeoSetting>;
  updateSeoSetting(id: number, seoSetting: Partial<InsertSeoSetting>): Promise<SeoSetting | undefined>;
  listSeoSettings(): Promise<SeoSetting[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private levels: Map<number, Level>;
  private countries: Map<number, Country>;
  private scholarships: Map<number, Scholarship>;
  private posts: Map<number, Post>;
  private tags: Map<number, Tag>;
  private postTags: Map<number, PostTag>;
  private successStories: Map<number, SuccessStory>;
  private subscribers: Map<number, Subscriber>;
  private seoSettings: Map<number, SeoSetting>;
  private currentIds: {
    users: number;
    categories: number;
    levels: number;
    countries: number;
    scholarships: number;
    posts: number;
    tags: number;
    postTags: number;
    successStories: number;
    subscribers: number;
    seoSettings: number;
  };

  constructor() {
    // Initialize maps
    this.users = new Map();
    this.categories = new Map();
    this.levels = new Map();
    this.countries = new Map();
    this.scholarships = new Map();
    this.posts = new Map();
    this.tags = new Map();
    this.postTags = new Map();
    this.successStories = new Map();
    this.subscribers = new Map();
    this.seoSettings = new Map();

    // Initialize IDs
    this.currentIds = {
      users: 1,
      categories: 1,
      levels: 1,
      countries: 1,
      scholarships: 1,
      posts: 1,
      tags: 1,
      postTags: 1,
      successStories: 1,
      subscribers: 1,
      seoSettings: 1
    };

    // Seed initial data
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@fullsco.com",
      fullName: "Admin User",
      role: "admin"
    });

    // Seed categories
    const categories = [
      { name: "Undergraduate", slug: "undergraduate", description: "Scholarships for undergraduate students" },
      { name: "Masters", slug: "masters", description: "Scholarships for master's degree students" },
      { name: "PhD", slug: "phd", description: "Scholarships for doctoral students" },
      { name: "Research", slug: "research", description: "Scholarships for research programs" }
    ];
    for (const category of categories) {
      this.createCategory(category);
    }

    // Seed levels
    const levels = [
      { name: "Bachelor", slug: "bachelor" },
      { name: "Masters", slug: "masters" },
      { name: "PhD", slug: "phd" }
    ];
    for (const level of levels) {
      this.createLevel(level);
    }

    // Seed countries
    const countries = [
      { name: "USA", slug: "usa" },
      { name: "UK", slug: "uk" },
      { name: "Germany", slug: "germany" },
      { name: "Canada", slug: "canada" },
      { name: "Australia", slug: "australia" }
    ];
    for (const country of countries) {
      this.createCountry(country);
    }

    // Seed scholarships
    const scholarships = [
      {
        title: "Fulbright Scholarship Program",
        slug: "fulbright-scholarship-program",
        description: "The Fulbright Program offers grants for U.S. citizens to study, research, or teach English abroad and for non-U.S. citizens to study in the United States.",
        deadline: "June 30, 2023",
        amount: "$40,000/year",
        isFeatured: true,
        isFullyFunded: true,
        countryId: 1, // USA
        levelId: 2, // Masters
        categoryId: 2, // Masters
        requirements: "Academic excellence, leadership qualities, research proposal",
        applicationLink: "https://foreign.fulbrightonline.org/",
        imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
      },
      {
        title: "Chevening Scholarships",
        slug: "chevening-scholarships",
        description: "Chevening is the UK government's international scholarships program funded by the Foreign, Commonwealth and Development Office and partner organizations.",
        deadline: "November 2, 2023",
        amount: "Full tuition + stipend",
        isFeatured: true,
        isFullyFunded: true,
        countryId: 2, // UK
        levelId: 2, // Masters
        categoryId: 2, // Masters
        requirements: "Leadership potential, minimum 2 years work experience",
        applicationLink: "https://www.chevening.org/",
        imageUrl: "https://images.unsplash.com/photo-1605007493699-af65834f8a00"
      },
      {
        title: "DAAD Scholarships",
        slug: "daad-scholarships",
        description: "The German Academic Exchange Service (DAAD) offers scholarships for international students to study at German universities across various academic levels.",
        deadline: "October 15, 2023",
        amount: "€850-1,200/month",
        isFeatured: true,
        isFullyFunded: true,
        countryId: 3, // Germany
        levelId: 3, // PhD
        categoryId: 3, // PhD
        requirements: "Academic excellence, research proposal",
        applicationLink: "https://www.daad.de/en/",
        imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
      }
    ];
    for (const scholarship of scholarships) {
      this.createScholarship(scholarship);
    }

    // Seed articles/posts
    const posts = [
      {
        title: "How to Write a Winning Scholarship Essay",
        slug: "how-to-write-winning-scholarship-essay",
        content: "Learn the essential tips and strategies for crafting a compelling scholarship essay that will set you apart from other applicants and increase your chances of winning.",
        excerpt: "Learn the essential tips and strategies for crafting a compelling scholarship essay that will set you apart from other applicants and increase your chances of winning.",
        authorId: 1,
        imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1",
        isFeatured: true,
        metaTitle: "Writing Winning Scholarship Essays - Tips and Strategies",
        metaDescription: "Learn how to write compelling scholarship essays that stand out and increase your chances of success."
      },
      {
        title: "10 Common Scholarship Application Mistakes to Avoid",
        slug: "common-scholarship-application-mistakes",
        content: "Discover the most common pitfalls that scholarship applicants fall into and learn how to avoid them to maximize your chances of success.",
        excerpt: "Discover the most common pitfalls that scholarship applicants fall into and learn how to avoid them to maximize your chances of success.",
        authorId: 1,
        imageUrl: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0",
        isFeatured: true,
        metaTitle: "Common Scholarship Application Mistakes to Avoid",
        metaDescription: "Learn about the most frequent mistakes applicants make and how to avoid them to improve your chances of winning scholarships."
      },
      {
        title: "How to Prepare for a Scholarship Interview",
        slug: "how-to-prepare-scholarship-interview",
        content: "Master the art of scholarship interviews with our comprehensive guide covering common questions, professional etiquette, and strategies to showcase your strengths.",
        excerpt: "Master the art of scholarship interviews with our comprehensive guide covering common questions, professional etiquette, and strategies to showcase your strengths.",
        authorId: 1,
        imageUrl: "https://images.unsplash.com/photo-1518107616985-bd48230d3b20",
        isFeatured: true,
        metaTitle: "Scholarship Interview Preparation Guide",
        metaDescription: "A comprehensive guide to preparing for scholarship interviews, with tips, common questions, and strategies for success."
      }
    ];
    for (const post of posts) {
      this.createPost(post);
    }

    // Seed success stories
    const successStories = [
      {
        name: "Ahmed Mahmoud",
        title: "PhD in Computer Science at MIT",
        slug: "ahmed-mahmoud-fulbright",
        content: "Securing the Fulbright scholarship changed my life completely. I'm now pursuing my PhD at MIT, researching artificial intelligence and its applications in healthcare. The application process was challenging, but the resources from FULLSCO helped me craft a compelling application.",
        scholarshipName: "Fulbright Scholar",
        imageUrl: "https://randomuser.me/api/portraits/men/75.jpg"
      },
      {
        name: "Maria Rodriguez",
        title: "Masters in International Relations at Oxford",
        slug: "maria-rodriguez-chevening",
        content: "As a first-generation college student from Colombia, studying at Oxford seemed impossible. The Chevening Scholarship made it a reality. The application guides on FULLSCO were invaluable in helping me structure my essays and prepare for interviews.",
        scholarshipName: "Chevening Scholar",
        imageUrl: "https://randomuser.me/api/portraits/women/32.jpg"
      }
    ];
    for (const story of successStories) {
      this.createSuccessStory(story);
    }

    // Seed SEO settings
    const seoSettings = [
      {
        pagePath: "/",
        metaTitle: "FULLSCO - Find Your Perfect Scholarship Opportunity",
        metaDescription: "Discover thousands of scholarships worldwide and get guidance on how to apply successfully.",
        keywords: "scholarships, education funding, international scholarships, study abroad"
      },
      {
        pagePath: "/scholarships",
        metaTitle: "Browse Scholarships - FULLSCO",
        metaDescription: "Find the perfect scholarship opportunity for your academic journey. Filter by country, level, and field of study.",
        keywords: "scholarship search, academic funding, graduate scholarships, undergraduate scholarships"
      }
    ];
    for (const setting of seoSettings) {
      this.createSeoSetting(setting);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentIds.categories++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateCategory: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...updateCategory };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  async listCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  // Level methods
  async getLevel(id: number): Promise<Level | undefined> {
    return this.levels.get(id);
  }

  async getLevelBySlug(slug: string): Promise<Level | undefined> {
    return Array.from(this.levels.values()).find(
      (level) => level.slug === slug
    );
  }

  async createLevel(insertLevel: InsertLevel): Promise<Level> {
    const id = this.currentIds.levels++;
    const level: Level = { ...insertLevel, id };
    this.levels.set(id, level);
    return level;
  }

  async listLevels(): Promise<Level[]> {
    return Array.from(this.levels.values());
  }

  // Country methods
  async getCountry(id: number): Promise<Country | undefined> {
    return this.countries.get(id);
  }

  async getCountryBySlug(slug: string): Promise<Country | undefined> {
    return Array.from(this.countries.values()).find(
      (country) => country.slug === slug
    );
  }

  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const id = this.currentIds.countries++;
    const country: Country = { ...insertCountry, id };
    this.countries.set(id, country);
    return country;
  }

  async listCountries(): Promise<Country[]> {
    return Array.from(this.countries.values());
  }

  // Scholarship methods
  async getScholarship(id: number): Promise<Scholarship | undefined> {
    return this.scholarships.get(id);
  }

  async getScholarshipBySlug(slug: string): Promise<Scholarship | undefined> {
    return Array.from(this.scholarships.values()).find(
      (scholarship) => scholarship.slug === slug
    );
  }

  async createScholarship(insertScholarship: InsertScholarship): Promise<Scholarship> {
    const id = this.currentIds.scholarships++;
    const now = new Date();
    const scholarship: Scholarship = { 
      ...insertScholarship, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.scholarships.set(id, scholarship);
    return scholarship;
  }

  async updateScholarship(id: number, updateScholarship: Partial<InsertScholarship>): Promise<Scholarship | undefined> {
    const scholarship = this.scholarships.get(id);
    if (!scholarship) return undefined;

    const now = new Date();
    const updatedScholarship = { 
      ...scholarship, 
      ...updateScholarship,
      updatedAt: now 
    };
    this.scholarships.set(id, updatedScholarship);
    return updatedScholarship;
  }

  async deleteScholarship(id: number): Promise<boolean> {
    return this.scholarships.delete(id);
  }

  async listScholarships(filters?: { isFeatured?: boolean, countryId?: number, levelId?: number, categoryId?: number }): Promise<Scholarship[]> {
    let scholarships = Array.from(this.scholarships.values());
    
    if (filters) {
      if (filters.isFeatured !== undefined) {
        scholarships = scholarships.filter(s => s.isFeatured === filters.isFeatured);
      }
      
      if (filters.countryId !== undefined) {
        scholarships = scholarships.filter(s => s.countryId === filters.countryId);
      }
      
      if (filters.levelId !== undefined) {
        scholarships = scholarships.filter(s => s.levelId === filters.levelId);
      }
      
      if (filters.categoryId !== undefined) {
        scholarships = scholarships.filter(s => s.categoryId === filters.categoryId);
      }
    }
    
    return scholarships;
  }

  // Post methods
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(
      (post) => post.slug === slug
    );
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentIds.posts++;
    const now = new Date();
    const post: Post = { 
      ...insertPost, 
      id, 
      views: 0,
      createdAt: now, 
      updatedAt: now 
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updatePost: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;

    const now = new Date();
    const updatedPost = { 
      ...post, 
      ...updatePost,
      updatedAt: now 
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  async incrementPostViews(id: number): Promise<boolean> {
    const post = this.posts.get(id);
    if (!post) return false;

    const updatedPost = { 
      ...post,
      views: (post.views || 0) + 1
    };
    this.posts.set(id, updatedPost);
    return true;
  }

  async listPosts(filters?: { isFeatured?: boolean, authorId?: number }): Promise<Post[]> {
    let posts = Array.from(this.posts.values());
    
    if (filters) {
      if (filters.isFeatured !== undefined) {
        posts = posts.filter(p => p.isFeatured === filters.isFeatured);
      }
      
      if (filters.authorId !== undefined) {
        posts = posts.filter(p => p.authorId === filters.authorId);
      }
    }
    
    return posts;
  }

  // Tag methods
  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(
      (tag) => tag.slug === slug
    );
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.currentIds.tags++;
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  async listTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  // Post-Tag methods
  async getPostTags(postId: number): Promise<Tag[]> {
    const postTagEntries = Array.from(this.postTags.values())
      .filter(pt => pt.postId === postId);
    
    const tags: Tag[] = [];
    for (const entry of postTagEntries) {
      const tag = this.tags.get(entry.tagId);
      if (tag) tags.push(tag);
    }
    
    return tags;
  }

  async getTagPosts(tagId: number): Promise<Post[]> {
    const postTagEntries = Array.from(this.postTags.values())
      .filter(pt => pt.tagId === tagId);
    
    const posts: Post[] = [];
    for (const entry of postTagEntries) {
      const post = this.posts.get(entry.postId);
      if (post) posts.push(post);
    }
    
    return posts;
  }

  async addTagToPost(postId: number, tagId: number): Promise<PostTag> {
    // Check if already exists
    const existing = Array.from(this.postTags.values())
      .find(pt => pt.postId === postId && pt.tagId === tagId);
    
    if (existing) return existing;
    
    const id = this.currentIds.postTags++;
    const postTag: PostTag = { id, postId, tagId };
    this.postTags.set(id, postTag);
    return postTag;
  }

  async removeTagFromPost(postId: number, tagId: number): Promise<boolean> {
    const entry = Array.from(this.postTags.values())
      .find(pt => pt.postId === postId && pt.tagId === tagId);
    
    if (!entry) return false;
    
    return this.postTags.delete(entry.id);
  }

  // Success Story methods
  async getSuccessStory(id: number): Promise<SuccessStory | undefined> {
    return this.successStories.get(id);
  }

  async getSuccessStoryBySlug(slug: string): Promise<SuccessStory | undefined> {
    return Array.from(this.successStories.values()).find(
      (story) => story.slug === slug
    );
  }

  async createSuccessStory(insertStory: InsertSuccessStory): Promise<SuccessStory> {
    const id = this.currentIds.successStories++;
    const now = new Date();
    const story: SuccessStory = { ...insertStory, id, createdAt: now };
    this.successStories.set(id, story);
    return story;
  }

  async updateSuccessStory(id: number, updateStory: Partial<InsertSuccessStory>): Promise<SuccessStory | undefined> {
    const story = this.successStories.get(id);
    if (!story) return undefined;

    const updatedStory = { ...story, ...updateStory };
    this.successStories.set(id, updatedStory);
    return updatedStory;
  }

  async deleteSuccessStory(id: number): Promise<boolean> {
    return this.successStories.delete(id);
  }

  async listSuccessStories(): Promise<SuccessStory[]> {
    return Array.from(this.successStories.values());
  }

  // Newsletter subscriber methods
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    return this.subscribers.get(id);
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentIds.subscribers++;
    const now = new Date();
    const subscriber: Subscriber = { ...insertSubscriber, id, createdAt: now };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  async listSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }

  // SEO settings methods
  async getSeoSetting(id: number): Promise<SeoSetting | undefined> {
    return this.seoSettings.get(id);
  }

  async getSeoSettingByPath(pagePath: string): Promise<SeoSetting | undefined> {
    return Array.from(this.seoSettings.values()).find(
      (setting) => setting.pagePath === pagePath
    );
  }

  async createSeoSetting(insertSeoSetting: InsertSeoSetting): Promise<SeoSetting> {
    const id = this.currentIds.seoSettings++;
    const seoSetting: SeoSetting = { ...insertSeoSetting, id };
    this.seoSettings.set(id, seoSetting);
    return seoSetting;
  }

  async updateSeoSetting(id: number, updateSeoSetting: Partial<InsertSeoSetting>): Promise<SeoSetting | undefined> {
    const seoSetting = this.seoSettings.get(id);
    if (!seoSetting) return undefined;

    const updatedSeoSetting = { ...seoSetting, ...updateSeoSetting };
    this.seoSettings.set(id, updatedSeoSetting);
    return updatedSeoSetting;
  }

  async listSeoSettings(): Promise<SeoSetting[]> {
    return Array.from(this.seoSettings.values());
  }
}

export const storage = new MemStorage();
