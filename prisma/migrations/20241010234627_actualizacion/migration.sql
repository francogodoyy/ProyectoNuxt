-- CreateTable
CREATE TABLE `Postre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NULL,
    `calorias` VARCHAR(100) NULL,
    `precio` DOUBLE NULL,
    `fecha_elaboracion` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
