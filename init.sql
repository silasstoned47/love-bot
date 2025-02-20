-- Tabela para leads por página
CREATE TABLE IF NOT EXISTS page_540118319183094 (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    sender_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY sender_id (sender_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela para métricas
CREATE TABLE IF NOT EXISTS metrics_540118319183094 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id VARCHAR(255) NOT NULL,
    type ENUM('click', 'message', 'lead') NOT NULL,
    template_id VARCHAR(50) NULL,
    target_url TEXT NULL,
    button_text VARCHAR(255) NULL,
    message_text TEXT NULL,
    timestamp TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sender_type (sender_id, type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_template (template_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
