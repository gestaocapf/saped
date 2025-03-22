-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_assignedToId_fkey`;

-- DropIndex
DROP INDEX `Ticket_assignedToId_fkey` ON `Ticket`;

-- AlterTable
ALTER TABLE `Ticket` MODIFY `assignedToId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
