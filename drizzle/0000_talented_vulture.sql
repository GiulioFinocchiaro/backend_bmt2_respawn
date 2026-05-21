CREATE TABLE `config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mappa_mbt` (
	`id` text PRIMARY KEY NOT NULL,
	`mbt_id` text NOT NULL,
	`coord_y` integer NOT NULL,
	`coord_x` integer NOT NULL,
	`mappa_id` text NOT NULL,
	`created_at` text DEFAULT '2026-05-21T13:09:05.029Z',
	FOREIGN KEY (`mbt_id`) REFERENCES `mb_tmp`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mappa_id`) REFERENCES `mappe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mappe` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`image_url` text,
	`created_at` text DEFAULT '2026-05-21T13:09:05.029Z'
);
--> statement-breakpoint
CREATE TABLE `mb_tmp` (
	`id` text PRIMARY KEY NOT NULL,
	`metin_boss_id` text NOT NULL,
	`descrizione` text NOT NULL,
	`tempo_respawn` integer NOT NULL,
	`created_at` text DEFAULT '2026-05-21T13:09:05.029Z',
	FOREIGN KEY (`metin_boss_id`) REFERENCES `metin_boss`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `metin_boss` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`categoria` text DEFAULT 'Metin',
	`icona` text,
	`note` text,
	`created_at` text DEFAULT '2026-05-21T13:09:05.029Z'
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT '2026-05-21T13:09:05.029Z',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_tokens_token_unique` ON `refresh_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nome` text NOT NULL,
	`password_hash` text NOT NULL,
	`admin` integer DEFAULT false,
	`created_at` text DEFAULT '2026-05-21T13:09:05.028Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);