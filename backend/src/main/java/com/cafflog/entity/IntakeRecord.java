package com.cafflog.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "intake_records", indexes = {
    @Index(name = "idx_user_date", columnList = "user_id, recorded_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntakeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "record_type", nullable = false, length = 20)
    private String recordType;   // "homemade" or "brand"

    @Column(name = "caffeine_mg", nullable = false)
    private Integer caffeineMg;

    // -- homemade fields --
    @Column(name = "bean_name", length = 64)
    private String beanName;

    @Column(name = "bean_weight_g")
    private Double beanWeightG;

    @Column(name = "method_name", length = 64)
    private String methodName;

    @Column(name = "range_min")
    private Integer rangeMin;

    @Column(name = "range_max")
    private Integer rangeMax;

    // -- brand fields --
    @Column(name = "brand_name", length = 64)
    private String brandName;

    @Column(name = "drink_name", length = 128)
    private String drinkName;

    @Column(name = "size_name", length = 64)
    private String sizeName;

    @Column(name = "data_source", length = 20)
    private String dataSource;    // "official" or "estimated"

    @Column(name = "data_confidence", length = 10)
    private String dataConfidence; // "high", "medium", "low"

    // -- metadata --
    @Column(name = "recorded_at", nullable = false)
    private String recordedAt;     // ISO 8601 string

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
