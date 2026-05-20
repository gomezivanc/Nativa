/*
 Navicat Premium Dump SQL

 Source Server         : nygNginx
 Source Server Type    : MySQL
 Source Server Version : 80041 (8.0.41-0ubuntu0.22.04.1)
 Source Host           : 34.193.220.171:3306
 Source Schema         : tenant24410ed9-ef7a-4c48-a358-ae34dcf25d60

 Target Server Type    : MySQL
 Target Server Version : 80041 (8.0.41-0ubuntu0.22.04.1)
 File Encoding         : 65001

 Date: 03/03/2025 08:08:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for exp_files
-- ----------------------------
DROP TABLE IF EXISTS `exp_files`;
CREATE TABLE `exp_files` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Numero del expediente',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del expediente',
  `date_init` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Fecha de inicio del expediente',
  `exist_p` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Existe fisicamente?',
  `sub_exp` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Es sub expediente',
  `clasification_id` bigint unsigned DEFAULT NULL COMMENT 'ID de la clasificación',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Descripción',
  `serie` json DEFAULT NULL,
  `subserie` json DEFAULT NULL,
  `dependency_id` bigint unsigned DEFAULT NULL,
  `responsible_id` bigint DEFAULT NULL COMMENT 'Responsable del expediente: Modulo de usuarios',
  `add_subfile` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Agregar un subexpediente?',
  `sub_exp_id` bigint unsigned DEFAULT NULL,
  `creado_por_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `close_observation` text COLLATE utf8mb4_unicode_ci COMMENT 'Observacion de cierre del expediente',
  `is_pending_close` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Estado booleando de si esta pendiente de cerrar el expediente',
  `deleted_by` bigint DEFAULT NULL COMMENT 'ID de la persona que elimino',
  `state_transfer` tinyint NOT NULL DEFAULT '0' COMMENT '1: pendiente, 2: transferido 0: ninguna accion, 3: rechazado',
  `observation_transfer` text COLLATE utf8mb4_unicode_ci COMMENT 'Observacion de transferencia',
  `observation_reject` text COLLATE utf8mb4_unicode_ci,
  `return_at` date DEFAULT NULL,
  `state_loan_id` bigint unsigned DEFAULT NULL COMMENT 'Id del estado de prestamo',
  PRIMARY KEY (`id`),
  KEY `exp_files_clasification_id_foreign` (`clasification_id`),
  KEY `exp_files_dependency_id_foreign` (`dependency_id`),
  KEY `exp_files_sub_exp_id_foreign` (`sub_exp_id`),
  KEY `exp_files_state_loan_id_foreign` (`state_loan_id`),
  CONSTRAINT `exp_files_clasification_id_foreign` FOREIGN KEY (`clasification_id`) REFERENCES `exp_files_clasifications` (`id`),
  CONSTRAINT `exp_files_dependency_id_foreign` FOREIGN KEY (`dependency_id`) REFERENCES `g_d_dependencies` (`id`),
  CONSTRAINT `exp_files_state_loan_id_foreign` FOREIGN KEY (`state_loan_id`) REFERENCES `type_documentary_loans` (`id`),
  CONSTRAINT `exp_files_sub_exp_id_foreign` FOREIGN KEY (`sub_exp_id`) REFERENCES `exp_files` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of exp_files
-- ----------------------------
BEGIN;
INSERT INTO `exp_files` (`id`, `number`, `name`, `date_init`, `exist_p`, `sub_exp`, `clasification_id`, `description`, `serie`, `subserie`, `dependency_id`, `responsible_id`, `add_subfile`, `sub_exp_id`, `creado_por_id`, `created_at`, `updated_at`, `deleted_at`, `close_observation`, `is_pending_close`, `deleted_by`, `state_transfer`, `observation_transfer`, `observation_reject`, `return_at`, `state_loan_id`) VALUES (1, '20255003494', 'jhon', '2025-02-13', 0, 0, 1, 'jjj', '\"{\\\"code\\\":\\\"02\\\",\\\"name\\\":\\\"INFORMES\\\"}\"', '\"{\\\"code\\\":\\\"01\\\",\\\"name\\\":\\\"Informes a entes de control\\\",\\\"item_support_e\\\":null,\\\"item_support_p\\\":\\\"X\\\",\\\"items_year_central\\\":\\\"8\\\",\\\"items_year_gestion\\\":\\\"2\\\",\\\"items_dispo_final_e\\\":null,\\\"items_dispo_final_s\\\":null,\\\"items_pro_subseries\\\":\\\"En esta subserie se registran las respuestas a todos los requerimientos y auditorias de los entes de control relacionados con los procesos, avances y la toma de decisiones de la entidad. serie documental con valor administrativo e hist\\\\u00edrico de conservaci\\\\u00f3n total ya que reflejan el desarrollo,  cumplimiento y  ejecuci\\\\u00f3n de los procesos de la entidad.  una vez se cumpla dos (2)  a\\\\u00f1os en el archivo de gesti\\\\u00f3n que se contar\\\\u00f3n a partir del \\\\u00faltimo informe de la vigencia fiscal, pasara ocho (8) a\\\\u00f1os en el archivo central, posteriormente estos ser\\\\u00e1n enviados al archivo hist\\\\u00edrico,  se realizar\\\\u00f3 la digitalizaci\\\\u00f3n certificada proceso que ser\\\\u00e1 revisado por el grupo de archivo y correspondencia haga sus veces de acuerdo al procedimiento establecido por la entidad antes de realizar el traslado al archivo hist\\\\u00edrico. se debe conservar en soporte original y medio tecnol\\\\u00f3gico. constituci\\\\u00f3n pol\\\\u00f3\\\\u00adtica de colombia. art\\\\u00edculos  119 y 278,  ley 734 de 2002.\\\",\\\"items_dispo_final_ct\\\":\\\"X\\\",\\\"items_dispo_final_md\\\":\\\"X\\\",\\\"series\\\":{\\\"code\\\":\\\"02\\\",\\\"name\\\":\\\"INFORMES\\\"}}\"', 2, 1, 0, NULL, 1, '2025-02-05 12:35:42', '2025-02-10 11:39:21', '2025-02-10 11:39:21', 'ñlññ', 0, 1, 0, NULL, NULL, NULL, 1);
INSERT INTO `exp_files` (`id`, `number`, `name`, `date_init`, `exist_p`, `sub_exp`, `clasification_id`, `description`, `serie`, `subserie`, `dependency_id`, `responsible_id`, `add_subfile`, `sub_exp_id`, `creado_por_id`, `created_at`, `updated_at`, `deleted_at`, `close_observation`, `is_pending_close`, `deleted_by`, `state_transfer`, `observation_transfer`, `observation_reject`, `return_at`, `state_loan_id`) VALUES (2, '20256578982', 'klj', '2025-01-29', 1, 0, 1, 'df', '{\"code\": \"03\", \"name\": \"COMUNICACIONES OFICIALES\"}', '{\"code\": \"01\", \"name\": \"Comunicaciones externas\", \"series\": {\"code\": \"03\", \"name\": \"COMUNICACIONES OFICIALES\"}, \"item_support_e\": null, \"item_support_p\": \"X\", \"items_year_central\": \"20\", \"items_year_gestion\": \"2\", \"items_dispo_final_e\": null, \"items_dispo_final_s\": \"X\", \"items_pro_subseries\": \"En estos archivos se detallan los procesos para el reconocimiento de un auxilio monetario que se reconoce a quien ha demostrado haber asumido los gastos fúnebres de un afiliado o pensionado de acuerdo a lo establecido en la  ley 33 de 1985, decreto 2837 de 1986, ley 100 de 1993, decreto 1889 de 1994, ley 776 de 2002 y demás normas concordantes. el tiempo de retención establecido en el art. 9 del acuerdo 006 de 2011 del agn, por lo tanto en archivo de gestión tendrá una retención de dos (2)  años a partir de la notificación del  último acto administrativo de la prestación, una vez cumplido este término se transferirá para cumplir veinte (20) años en el archivo central a partir de la fecha en que se extinga el derecho a la prestación por cualquiera de las causales de ley según, por lo que solicitará al grupo de reconocimiento del fondo certificación en donde se establezca el no pago de mesadas.  cumplido último periodo se realizará la digitalización proceso que será revisado por el grupo de archivo y correspondencia haga sus veces,  para posteriormente ser transferido al archivo histírico, se debe conservar en soporte original  y medio tecnológico ya  cuenta con valores técnicos que refleja actividades misionales y operacionales de la entidad.\", \"items_dispo_final_ct\": null, \"items_dispo_final_md\": \"X\"}', 6, 3, 0, NULL, 1, '2025-02-10 11:32:17', '2025-02-10 14:37:51', '2025-02-10 14:37:51', NULL, 0, NULL, 1, 'hh', NULL, NULL, 1);
INSERT INTO `exp_files` (`id`, `number`, `name`, `date_init`, `exist_p`, `sub_exp`, `clasification_id`, `description`, `serie`, `subserie`, `dependency_id`, `responsible_id`, `add_subfile`, `sub_exp_id`, `creado_por_id`, `created_at`, `updated_at`, `deleted_at`, `close_observation`, `is_pending_close`, `deleted_by`, `state_transfer`, `observation_transfer`, `observation_reject`, `return_at`, `state_loan_id`) VALUES (3, '20256153598', 'EXPEDIENTE PRUEBA HOY.', '2025-01-29', 0, 0, 1, 'CARGA DE PDFs', '{\"code\": \"03\", \"name\": \"COMUNICACIONES OFICIALES\"}', '{\"code\": \"01\", \"name\": \"Comunicaciones externas\", \"series\": {\"code\": \"03\", \"name\": \"COMUNICACIONES OFICIALES\"}, \"item_support_e\": null, \"item_support_p\": \"X\", \"items_year_central\": \"20\", \"items_year_gestion\": \"2\", \"items_dispo_final_e\": null, \"items_dispo_final_s\": \"X\", \"items_pro_subseries\": \"En estos archivos se detallan los procesos para el reconocimiento de un auxilio monetario que se reconoce a quien ha demostrado haber asumido los gastos fúnebres de un afiliado o pensionado de acuerdo a lo establecido en la  ley 33 de 1985, decreto 2837 de 1986, ley 100 de 1993, decreto 1889 de 1994, ley 776 de 2002 y demás normas concordantes. el tiempo de retención establecido en el art. 9 del acuerdo 006 de 2011 del agn, por lo tanto en archivo de gestión tendrá una retención de dos (2)  años a partir de la notificación del  último acto administrativo de la prestación, una vez cumplido este término se transferirá para cumplir veinte (20) años en el archivo central a partir de la fecha en que se extinga el derecho a la prestación por cualquiera de las causales de ley según, por lo que solicitará al grupo de reconocimiento del fondo certificación en donde se establezca el no pago de mesadas.  cumplido último periodo se realizará la digitalización proceso que será revisado por el grupo de archivo y correspondencia haga sus veces,  para posteriormente ser transferido al archivo histírico, se debe conservar en soporte original  y medio tecnológico ya  cuenta con valores técnicos que refleja actividades misionales y operacionales de la entidad.\", \"items_dispo_final_ct\": null, \"items_dispo_final_md\": \"X\"}', 2, 1, 0, NULL, 1, '2025-02-11 00:25:40', '2025-02-10 14:43:09', NULL, NULL, 0, NULL, 2, 'Prueba Alexander', NULL, NULL, 1);
INSERT INTO `exp_files` (`id`, `number`, `name`, `date_init`, `exist_p`, `sub_exp`, `clasification_id`, `description`, `serie`, `subserie`, `dependency_id`, `responsible_id`, `add_subfile`, `sub_exp_id`, `creado_por_id`, `created_at`, `updated_at`, `deleted_at`, `close_observation`, `is_pending_close`, `deleted_by`, `state_transfer`, `observation_transfer`, `observation_reject`, `return_at`, `state_loan_id`) VALUES (4, '20255509340', 'Declan Wise', '1994-05-09', 1, 0, 1, 'Mollit quisquam dese', '{\"code\": \"02\", \"name\": \"INFORMES\"}', '{\"code\": \"01\", \"name\": \"Informes a entes de control\", \"series\": {\"code\": \"02\", \"name\": \"INFORMES\"}, \"item_support_e\": null, \"item_support_p\": \"X\", \"items_year_central\": \"8\", \"items_year_gestion\": \"2\", \"items_dispo_final_e\": null, \"items_dispo_final_s\": null, \"items_pro_subseries\": \"En esta subserie se registran las respuestas a todos los requerimientos y auditorias de los entes de control relacionados con los procesos, avances y la toma de decisiones de la entidad. serie documental con valor administrativo e histírico de conservación total ya que reflejan el desarrollo,  cumplimiento y  ejecución de los procesos de la entidad.  una vez se cumpla dos (2)  años en el archivo de gestión que se contarón a partir del último informe de la vigencia fiscal, pasara ocho (8) años en el archivo central, posteriormente estos serán enviados al archivo histírico,  se realizaró la digitalización certificada proceso que será revisado por el grupo de archivo y correspondencia haga sus veces de acuerdo al procedimiento establecido por la entidad antes de realizar el traslado al archivo histírico. se debe conservar en soporte original y medio tecnológico. constitución poló­tica de colombia. artículos  119 y 278,  ley 734 de 2002.\", \"items_dispo_final_ct\": \"X\", \"items_dispo_final_md\": \"X\"}', 2, 1, 0, NULL, 1, '2025-02-14 09:59:57', '2025-02-14 10:03:21', NULL, NULL, 0, NULL, 1, '+´´pfyt\'p´´ñi0plopmjoihjujopi', NULL, NULL, 1);
INSERT INTO `exp_files` (`id`, `number`, `name`, `date_init`, `exist_p`, `sub_exp`, `clasification_id`, `description`, `serie`, `subserie`, `dependency_id`, `responsible_id`, `add_subfile`, `sub_exp_id`, `creado_por_id`, `created_at`, `updated_at`, `deleted_at`, `close_observation`, `is_pending_close`, `deleted_by`, `state_transfer`, `observation_transfer`, `observation_reject`, `return_at`, `state_loan_id`) VALUES (5, '20257895097', 'ac/dc thunderstruck', '2025-02-18', 1, 0, 1, 'Prueba ac/dc thunderstruck', '{\"code\": \"02\", \"name\": \"INFORMES\"}', '{\"code\": \"01\", \"name\": \"Informes a entes de control\", \"series\": {\"code\": \"02\", \"name\": \"INFORMES\"}, \"item_support_e\": null, \"item_support_p\": \"X\", \"items_year_central\": \"8\", \"items_year_gestion\": \"2\", \"items_dispo_final_e\": null, \"items_dispo_final_s\": null, \"items_pro_subseries\": \"En esta subserie se registran las respuestas a todos los requerimientos y auditorias de los entes de control relacionados con los procesos, avances y la toma de decisiones de la entidad. serie documental con valor administrativo e histírico de conservación total ya que reflejan el desarrollo,  cumplimiento y  ejecución de los procesos de la entidad.  una vez se cumpla dos (2)  años en el archivo de gestión que se contarón a partir del último informe de la vigencia fiscal, pasara ocho (8) años en el archivo central, posteriormente estos serán enviados al archivo histírico,  se realizaró la digitalización certificada proceso que será revisado por el grupo de archivo y correspondencia haga sus veces de acuerdo al procedimiento establecido por la entidad antes de realizar el traslado al archivo histírico. se debe conservar en soporte original y medio tecnológico. constitución poló­tica de colombia. artículos  119 y 278,  ley 734 de 2002.\", \"items_dispo_final_ct\": \"X\", \"items_dispo_final_md\": \"X\"}', 2, 1, 0, NULL, 1, '2025-02-18 14:43:26', '2025-02-18 14:59:24', NULL, NULL, 0, NULL, 0, NULL, NULL, NULL, 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
