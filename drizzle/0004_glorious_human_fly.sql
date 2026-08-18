CREATE TABLE `contactInquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'unread',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactInquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storeSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`atelierLocation` varchar(255) NOT NULL DEFAULT 'Gulberg III, Lahore, Pakistan',
	`supportEmail` varchar(320) NOT NULL DEFAULT 'concierge@bysalma.com',
	`supportPhone` varchar(100) NOT NULL DEFAULT '+92 (42) 3500 SALMA',
	`hoursOfOperation` varchar(255) NOT NULL DEFAULT 'Monday — Saturday: 10:00 AM – 7:00 PM PKT',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storeSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `footerSettings` ADD `facebookHref` varchar(255) DEFAULT 'https://facebook.com' NOT NULL;--> statement-breakpoint
ALTER TABLE `footerSettings` ADD `instagramHref` varchar(255) DEFAULT 'https://instagram.com' NOT NULL;--> statement-breakpoint
ALTER TABLE `footerSettings` ADD `whatsappNumber` varchar(50) DEFAULT '+923000000000' NOT NULL;