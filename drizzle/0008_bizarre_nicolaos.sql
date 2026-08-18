ALTER TABLE `storeSettings` ADD `brandLogoUrl` text DEFAULT ('') NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `brandMonogram` varchar(20) DEFAULT 'BS' NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `brandTitle` varchar(100) DEFAULT 'BY SALMA' NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `themeMode` varchar(20) DEFAULT 'light' NOT NULL;