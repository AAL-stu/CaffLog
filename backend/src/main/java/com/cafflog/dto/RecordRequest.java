package com.cafflog.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecordRequest {

    @NotBlank(message = "记录类型不能为空")
    private String recordType;  // "homemade" or "brand"

    @NotNull(message = "咖啡因含量不能为空")
    @Min(value = 1, message = "咖啡因含量必须大于0")
    private Integer caffeineMg;

    // homemade fields
    private String beanName;
    private Double beanWeightG;
    private String methodName;
    private Integer rangeMin;
    private Integer rangeMax;

    // brand fields
    private String brandName;
    private String drinkName;
    private String sizeName;
    private String dataSource;
    private String dataConfidence;

    private String recordedAt;  // ISO 8601, optional (defaults to now)
}
