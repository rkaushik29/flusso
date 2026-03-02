CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon` text DEFAULT 'more-horiz' NOT NULL,
	`type` text DEFAULT 'expense' NOT NULL,
	`budget_type` text,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monthly_budgets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`month` text NOT NULL,
	`essential_percent` real DEFAULT 50 NOT NULL,
	`discretionary_percent` real DEFAULT 30 NOT NULL,
	`investment_percent` real DEFAULT 20 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_budgets_month_unique` ON `monthly_budgets` (`month`);--> statement-breakpoint
CREATE TABLE `recurring_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`type` text DEFAULT 'expense' NOT NULL,
	`category_id` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`day_of_month` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`type` text DEFAULT 'expense' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`category_id` integer,
	`date` text NOT NULL,
	`is_recurring` integer DEFAULT false NOT NULL,
	`recurring_item_id` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recurring_item_id`) REFERENCES `recurring_items`(`id`) ON UPDATE no action ON DELETE no action
);
