/*
  Warnings:

  - You are about to drop the `Key` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Key` DROP FOREIGN KEY `Key_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_user_id_fkey`;

-- DropTable
DROP TABLE `Key`;

-- DropTable
DROP TABLE `Session`;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `active_expires` BIGINT NOT NULL,
    `idle_expires` BIGINT NOT NULL,

    UNIQUE INDEX `session_id_key`(`id`),
    INDEX `session_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_key` (
    `id` VARCHAR(191) NOT NULL,
    `hashed_password` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `auth_key_id_key`(`id`),
    INDEX `auth_key_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_key` ADD CONSTRAINT `auth_key_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
