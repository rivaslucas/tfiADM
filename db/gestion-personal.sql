CREATE DATABASE  IF NOT EXISTS `gestion_personal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gestion_personal`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gestion_personal
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `idAsistencia` int NOT NULL AUTO_INCREMENT,
  `idEmpleado` int NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('PRESENTE','AUSENTE','TARDANZA','VACACIONES','LICENCIA','JUSTIFICADO') NOT NULL,
  `hora_entrada` time DEFAULT NULL,
  `hora_salida` time DEFAULT '17:00:00',
  `observaciones` text,
  `registradoPor` int NOT NULL,
  `fechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `horas_trabajadas` decimal(6,2) GENERATED ALWAYS AS ((case when ((`hora_entrada` is not null) and (`estado` in (_utf8mb4'PRESENTE',_utf8mb4'TARDANZA'))) then greatest(0,least(1000,(timestampdiff(MINUTE,concat(`fecha`,_utf8mb4' ',`hora_entrada`),concat(`fecha`,_utf8mb4' ',coalesce(`hora_salida`,_utf8mb4'17:00:00'))) / 60.0))) else 0 end)) STORED,
  PRIMARY KEY (`idAsistencia`),
  UNIQUE KEY `unique_empleado_fecha` (`idEmpleado`,`fecha`),
  KEY `registradoPor` (`registradoPor`),
  KEY `idx_fecha` (`fecha`),
  KEY `idx_empleado` (`idEmpleado`),
  KEY `idx_estado` (`estado`),
  CONSTRAINT `asistencias_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`),
  CONSTRAINT `asistencias_ibfk_2` FOREIGN KEY (`registradoPor`) REFERENCES `empleados` (`idEmpleado`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tabla de registro de asistencias de empleados con hora de salida fija a las 17:00';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` (`idAsistencia`, `idEmpleado`, `fecha`, `estado`, `hora_entrada`, `hora_salida`, `observaciones`, `registradoPor`, `fechaRegistro`) VALUES (39,2,'2025-10-13','PRESENTE','08:15:00','17:00:00','Asistencia puntual',1,'2025-10-23 02:37:48'),(40,2,'2025-10-14','PRESENTE','08:30:00','17:00:00','Llegada normal',1,'2025-10-23 02:37:48'),(41,2,'2025-10-15','TARDANZA','09:45:00','17:00:00','Tráfico pesado',1,'2025-10-23 02:37:48'),(42,2,'2025-10-16','PRESENTE','08:00:00','17:00:00','Asistencia temprano',1,'2025-10-23 02:37:48'),(43,2,'2025-10-17','AUSENTE',NULL,'17:00:00','Enfermedad gripal',1,'2025-10-23 02:37:48'),(44,3,'2025-10-13','PRESENTE','08:20:00','17:00:00','Asistencia normal',1,'2025-10-23 02:38:14'),(45,3,'2025-10-14','PRESENTE','08:25:00','17:00:00','Asistencia normal',1,'2025-10-23 02:38:14'),(46,3,'2025-10-15','PRESENTE','08:35:00','17:00:00','Asistencia normal',1,'2025-10-23 02:38:14'),(47,3,'2025-10-16','JUSTIFICADO',NULL,'17:00:00','Consulta médica programada',1,'2025-10-23 02:38:14'),(48,3,'2025-10-17','PRESENTE','08:40:00','17:00:00','Asistencia normal',1,'2025-10-23 02:38:14'),(49,2,'2025-09-01','PRESENTE','08:15:00','17:00:00','Inicio de mes',1,'2025-10-23 02:51:51'),(50,2,'2025-09-02','PRESENTE','08:20:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(51,2,'2025-09-03','PRESENTE','08:10:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(52,2,'2025-09-04','TARDANZA','09:30:00','17:00:00','Problemas de transporte',1,'2025-10-23 02:51:51'),(53,2,'2025-09-05','PRESENTE','08:05:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(54,2,'2025-09-08','PRESENTE','08:25:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(55,2,'2025-09-09','PRESENTE','08:15:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(56,2,'2025-09-10','AUSENTE',NULL,'17:00:00','Enfermedad',1,'2025-10-23 02:51:51'),(57,2,'2025-09-11','PRESENTE','08:30:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(58,2,'2025-09-12','PRESENTE','08:20:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(59,2,'2025-09-15','PRESENTE','08:10:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(60,2,'2025-09-16','PRESENTE','08:35:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(61,2,'2025-09-17','JUSTIFICADO',NULL,'17:00:00','Trámite personal',1,'2025-10-23 02:51:51'),(62,2,'2025-09-18','PRESENTE','08:15:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(63,2,'2025-09-19','PRESENTE','08:25:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(64,2,'2025-09-22','TARDANZA','09:15:00','17:00:00','Cita médica',1,'2025-10-23 02:51:51'),(65,2,'2025-09-23','PRESENTE','08:05:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(66,2,'2025-09-24','PRESENTE','08:20:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(67,2,'2025-09-25','PRESENTE','08:30:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(68,2,'2025-09-26','PRESENTE','08:15:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(69,2,'2025-09-29','PRESENTE','08:10:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(70,2,'2025-09-30','PRESENTE','08:25:00','17:00:00','Fin de mes',1,'2025-10-23 02:51:51'),(71,3,'2025-09-01','PRESENTE','08:30:00','17:00:00','Inicio de mes',1,'2025-10-23 02:51:51'),(72,3,'2025-09-02','PRESENTE','08:25:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(73,3,'2025-09-03','PRESENTE','08:35:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(74,3,'2025-09-04','PRESENTE','08:20:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(75,3,'2025-09-05','PRESENTE','08:40:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(76,3,'2025-09-08','AUSENTE',NULL,'17:00:00','Enfermedad familiar',1,'2025-10-23 02:51:51'),(77,3,'2025-09-09','PRESENTE','08:45:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(78,3,'2025-09-10','PRESENTE','08:30:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(79,3,'2025-09-11','PRESENTE','08:25:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(80,3,'2025-09-12','TARDANZA','10:00:00','17:00:00','Problemas de tráfico',1,'2025-10-23 02:51:51'),(81,3,'2025-09-15','PRESENTE','08:35:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(82,3,'2025-09-16','PRESENTE','08:20:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(83,3,'2025-09-17','PRESENTE','08:30:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(84,3,'2025-09-18','VACACIONES',NULL,'17:00:00','Días de vacaciones',1,'2025-10-23 02:51:51'),(85,3,'2025-09-19','VACACIONES',NULL,'17:00:00','Días de vacaciones',1,'2025-10-23 02:51:51'),(86,3,'2025-09-22','PRESENTE','08:25:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(87,3,'2025-09-23','PRESENTE','08:40:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(88,3,'2025-09-24','PRESENTE','08:30:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(89,3,'2025-09-25','PRESENTE','08:20:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(90,3,'2025-09-26','JUSTIFICADO',NULL,'17:00:00','Exámen médico',1,'2025-10-23 02:51:51'),(91,3,'2025-09-29','PRESENTE','08:35:00','17:00:00','Asistencia normal',1,'2025-10-23 02:51:51'),(92,3,'2025-09-30','PRESENTE','08:25:00','17:00:00','Fin de mes',1,'2025-10-23 02:51:51'),(93,3,'2025-10-24','PRESENTE','08:30:00','17:00:00','Asistencia normal',1,'2025-10-23 03:22:31'),(94,4,'2025-10-24','PRESENTE','09:30:00','17:00:00','Corregido - llegó más temprano de lo registrado',1,'2025-10-23 03:23:10'),(95,15,'2025-10-24','AUSENTE',NULL,'17:00:00','Consulta médica',1,'2025-10-23 03:23:42');
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleadoroles`
--

DROP TABLE IF EXISTS `empleadoroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleadoroles` (
  `idEmpleado` int NOT NULL,
  `idRol` int NOT NULL,
  `fechaAsignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idEmpleado`,`idRol`),
  KEY `idRol` (`idRol`),
  CONSTRAINT `empleadoroles_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `empleadoroles_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `roles` (`idRol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleadoroles`
--

LOCK TABLES `empleadoroles` WRITE;
/*!40000 ALTER TABLE `empleadoroles` DISABLE KEYS */;
INSERT INTO `empleadoroles` VALUES (1,1,'2025-10-04 15:16:03'),(2,2,'2025-10-04 15:16:03'),(2,4,'2025-10-04 15:16:03'),(3,3,'2025-10-04 15:16:03'),(4,3,'2025-10-04 15:16:03'),(4,5,'2025-10-04 15:16:03'),(15,3,'2025-10-10 18:25:18'),(16,2,'2025-10-23 13:01:40');
/*!40000 ALTER TABLE `empleadoroles` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_empleadoroles_insert` AFTER INSERT ON `empleadoroles` FOR EACH ROW BEGIN
    UPDATE usuarios 
    SET rol = CASE NEW.idRol
        WHEN 1 THEN 'administrador'
        WHEN 2 THEN 'gerente'
        WHEN 3 THEN 'empleado'
        WHEN 4 THEN 'supervisor'
        WHEN 5 THEN 'operario'
        ELSE rol
    END
    WHERE idEmpleado = NEW.idEmpleado;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_empleadoroles_update` AFTER UPDATE ON `empleadoroles` FOR EACH ROW BEGIN
    UPDATE usuarios 
    SET rol = CASE NEW.idRol
        WHEN 1 THEN 'administrador'
        WHEN 2 THEN 'gerente'
        WHEN 3 THEN 'empleado'
        WHEN 4 THEN 'supervisor'
        WHEN 5 THEN 'operario'
        ELSE rol
    END
    WHERE idEmpleado = NEW.idEmpleado;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `idEmpleado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `fechaIngreso` date DEFAULT NULL,
  `sueldoBase` decimal(10,2) NOT NULL DEFAULT '0.00',
  `idSector` int DEFAULT NULL,
  `idSupervisor` int DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idEmpleado`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `dni_2` (`dni`),
  KEY `idSector` (`idSector`),
  KEY `idSupervisor` (`idSupervisor`),
  CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`idSector`) REFERENCES `sectores` (`idSector`),
  CONSTRAINT `empleados_ibfk_2` FOREIGN KEY (`idSupervisor`) REFERENCES `empleados` (`idEmpleado`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1,'Admin','Principal','99999999','Dirección Admin','123456789','admin@empresa.com','2025-10-04',100000.00,1,NULL,1,'2025-10-04 15:16:03'),(2,'Juan','Pérez','12345678','Calle 123','111111111','juan@empresa.com','2023-01-15',50000.00,2,2,1,'2025-10-04 15:16:03'),(3,'María','Gómez','23456789','Av. Siempre 456','222222222','maria@empresa.com','2023-02-20',45000.00,2,1,1,'2025-10-04 15:16:03'),(4,'Carlos','López','34567890','Bv. Libertad 789','333333333','carlos@empresa.com','2023-03-10',48000.00,2,2,1,'2025-10-04 15:16:03'),(15,'Ana','Martínez','44443333','Av. Principal 789','444444444','ana.martinez@empresa.com','2024-01-20',47000.00,3,1,0,'2025-10-10 18:25:17'),(16,'Luis','Rodríguez','55666777','Calle Secundaria 123','555555555','luis@empresa.com','2024-03-01',52000.00,2,2,0,'2025-10-23 01:13:38');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialessectores`
--

DROP TABLE IF EXISTS `historialessectores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialessectores` (
  `idHistorialSector` int NOT NULL AUTO_INCREMENT,
  `idSector` int NOT NULL,
  `idGerente` int NOT NULL,
  `mes` int NOT NULL,
  `año` int NOT NULL,
  `porcentajeAsistencia` decimal(5,2) NOT NULL,
  `totalEmpleados` int NOT NULL,
  `fechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idHistorialSector`),
  UNIQUE KEY `unique_sector_mes_año` (`idSector`,`mes`,`año`),
  KEY `idGerente` (`idGerente`),
  CONSTRAINT `historialessectores_ibfk_1` FOREIGN KEY (`idSector`) REFERENCES `sectores` (`idSector`),
  CONSTRAINT `historialessectores_ibfk_2` FOREIGN KEY (`idGerente`) REFERENCES `empleados` (`idEmpleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialessectores`
--

LOCK TABLES `historialessectores` WRITE;
/*!40000 ALTER TABLE `historialessectores` DISABLE KEYS */;
/*!40000 ALTER TABLE `historialessectores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialsueldos`
--

DROP TABLE IF EXISTS `historialsueldos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialsueldos` (
  `idHistorialSueldo` int NOT NULL AUTO_INCREMENT,
  `idEmpleado` int NOT NULL,
  `sueldoAnterior` decimal(10,2) DEFAULT NULL,
  `sueldoNuevo` decimal(10,2) NOT NULL,
  `fechaCambio` date NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `registradoPor` int NOT NULL,
  `fechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idHistorialSueldo`),
  KEY `idEmpleado` (`idEmpleado`),
  KEY `registradoPor` (`registradoPor`),
  CONSTRAINT `historialsueldos_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`),
  CONSTRAINT `historialsueldos_ibfk_2` FOREIGN KEY (`registradoPor`) REFERENCES `empleados` (`idEmpleado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialsueldos`
--

LOCK TABLES `historialsueldos` WRITE;
/*!40000 ALTER TABLE `historialsueldos` DISABLE KEYS */;
INSERT INTO `historialsueldos` VALUES (1,2,45000.00,50000.00,'2023-06-01','Aumento por desempeño',1,'2025-10-04 15:16:03'),(2,3,40000.00,45000.00,'2023-06-01','Ajuste inflacionario',1,'2025-10-04 15:16:03');
/*!40000 ALTER TABLE `historialsueldos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indemnizaciones`
--

DROP TABLE IF EXISTS `indemnizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indemnizaciones` (
  `idIndemnizacion` int NOT NULL AUTO_INCREMENT,
  `idEmpleado` int NOT NULL,
  `fechaCalculo` date NOT NULL,
  `tipoDespido` enum('justificado','injustificado') NOT NULL,
  `fechaIngreso` date NOT NULL,
  `fechaEgreso` date NOT NULL,
  `mejorSueldo` decimal(10,2) NOT NULL,
  `sueldoActual` decimal(10,2) NOT NULL,
  `antiguedadAnios` int NOT NULL,
  `antiguedadMeses` int NOT NULL,
  `diasVacaciones` int NOT NULL,
  `totalIndemnizacion` decimal(15,2) NOT NULL,
  `calculadoPor` int NOT NULL,
  `fechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idIndemnizacion`),
  KEY `idEmpleado` (`idEmpleado`),
  KEY `calculadoPor` (`calculadoPor`),
  CONSTRAINT `indemnizaciones_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`),
  CONSTRAINT `indemnizaciones_ibfk_2` FOREIGN KEY (`calculadoPor`) REFERENCES `empleados` (`idEmpleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indemnizaciones`
--

LOCK TABLES `indemnizaciones` WRITE;
/*!40000 ALTER TABLE `indemnizaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `indemnizaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recibossueldos`
--

DROP TABLE IF EXISTS `recibossueldos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recibossueldos` (
  `idRecibo` int NOT NULL AUTO_INCREMENT,
  `idEmpleado` int NOT NULL,
  `mes` int NOT NULL,
  `año` int NOT NULL,
  `sueldoBase` decimal(10,2) NOT NULL,
  `diasTrabajados` int NOT NULL,
  `diasAusentes` int NOT NULL,
  `diasJustificados` int NOT NULL,
  `descuentos` decimal(10,2) DEFAULT '0.00',
  `totalLiquidado` decimal(10,2) NOT NULL,
  `fechaGeneracion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `generadoPor` int NOT NULL,
  PRIMARY KEY (`idRecibo`),
  UNIQUE KEY `unique_empleado_mes_año` (`idEmpleado`,`mes`,`año`),
  KEY `generadoPor` (`generadoPor`),
  CONSTRAINT `recibossueldos_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`),
  CONSTRAINT `recibossueldos_ibfk_2` FOREIGN KEY (`generadoPor`) REFERENCES `empleados` (`idEmpleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recibossueldos`
--

LOCK TABLES `recibossueldos` WRITE;
/*!40000 ALTER TABLE `recibossueldos` DISABLE KEYS */;
/*!40000 ALTER TABLE `recibossueldos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `idRol` int NOT NULL AUTO_INCREMENT,
  `nombreRol` varchar(50) NOT NULL,
  `fechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idRol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'administrador','2025-10-04 15:16:03'),(2,'gerente','2025-10-04 15:16:03'),(3,'empleado','2025-10-04 15:16:03'),(4,'supervisor','2025-10-04 15:16:03'),(5,'operario','2025-10-04 15:16:03');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector`
--

DROP TABLE IF EXISTS `sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sector` (
  `idSector` int NOT NULL AUTO_INCREMENT,
  `nombreSector` varchar(50) NOT NULL,
  PRIMARY KEY (`idSector`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector`
--

LOCK TABLES `sector` WRITE;
/*!40000 ALTER TABLE `sector` DISABLE KEYS */;
/*!40000 ALTER TABLE `sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sectores`
--

DROP TABLE IF EXISTS `sectores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sectores` (
  `idSector` int NOT NULL AUTO_INCREMENT,
  `nombreSector` varchar(50) NOT NULL,
  `fechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idSector`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sectores`
--

LOCK TABLES `sectores` WRITE;
/*!40000 ALTER TABLE `sectores` DISABLE KEYS */;
INSERT INTO `sectores` VALUES (1,'Recursos Humanos','2025-10-04 15:16:03'),(2,'Ventas','2025-10-04 15:16:03'),(3,'Producción','2025-10-04 15:16:03'),(4,'Administración','2025-10-04 15:16:03'),(5,'Sistemas','2025-10-04 15:16:03');
/*!40000 ALTER TABLE `sectores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `idEmpleado` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `rol` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ultimoAcceso` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `email` (`email`),
  KEY `idEmpleado` (`idEmpleado`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (17,1,'admin@empresa.com','$2b$12$3CHyeaJmyMpkyuKojwG4NuWDN3qfSpL8UQ44rosj9StolT0koiDpK','administrador',1,'2025-10-04 17:14:16','2025-10-23 12:17:56'),(18,2,'juan@empresa.com','$2b$12$3CHyeaJmyMpkyuKojwG4NuWDN3qfSpL8UQ44rosj9StolT0koiDpK','gerente',1,'2025-10-04 17:14:16','2025-10-23 03:43:56'),(19,3,'maria@empresa.com','$2b$12$lZk9CfqxuT6HOlYezYnf8u8GsqR8XGno6BDeoRlZHxsk/g3j2zHdS','empleado',1,'2025-10-04 17:14:16','2025-10-05 18:38:24'),(20,4,'carlos@empresa.com','$2a$12$8ZG3GWHOsR.cL3B62U.1A.1u5u8b6Y5z5J5n5Y5V5N5B5V5N5B5V5N','empleado',1,'2025-10-04 17:14:16',NULL),(27,15,'ana.martinez@empresa.com','$2b$12$x8bmZ5WukWa40HaV01DGXOPwfI6dTDBMl3UTOPDIUW7pJn4xBs4vm','empleado',0,'2025-10-10 18:25:18','2025-10-22 23:32:49'),(28,16,'luis@empresa.com','$2b$12$48TeoEn3Vu07RwXnHqdkc.lgVFHdyf1CItzXqkaZDSLiEu1HSVMCy','gerente',0,'2025-10-23 01:13:40',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'gestion_personal'
--

--
-- Dumping routines for database 'gestion_personal'
--
/*!50003 DROP PROCEDURE IF EXISTS `ActualizarRolEmpleado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ActualizarRolEmpleado`(
    IN p_idEmpleado INT,
    IN p_idRol INT
)
BEGIN
    DECLARE existe_registro INT;
    
    -- Verificar si ya existe un registro
    SELECT COUNT(*) INTO existe_registro 
    FROM empleadoroles
    WHERE idEmpleado = p_idEmpleado;
    
    IF existe_registro > 0 THEN
        -- Actualizar rol existente
        UPDATE empleadoroles
        SET idRol = p_idRol, fechaAsignacion = NOW()
        WHERE idEmpleado = p_idEmpleado;
    ELSE
        -- Insertar nuevo rol
        INSERT INTO empleadoroles (idEmpleado, idRol, fechaAsignacion)
        VALUES (p_idEmpleado, p_idRol, NOW());
    END IF;
    
    -- El trigger se encargará de actualizar la tabla usuarios automáticamente
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-23 11:33:20
