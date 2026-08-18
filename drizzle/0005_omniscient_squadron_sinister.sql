ALTER TABLE `storeSettings` ADD `contactHeadline` varchar(255) DEFAULT 'Get in touch.' NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `contactIntro` text DEFAULT ('We are at your disposal for styling inquiries, order tracking, and bespoke requests.') NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `shippingHeadline` varchar(255) DEFAULT 'Shipping & Returns.' NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `shippingIntro` text DEFAULT ('Committed to immaculate presentation and secure doorstep delivery.') NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `shippingCards` text DEFAULT ('[]') NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `shippingSections` text DEFAULT ('[]') NOT NULL;