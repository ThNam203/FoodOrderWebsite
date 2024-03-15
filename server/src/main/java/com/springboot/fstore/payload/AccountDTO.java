package com.springboot.fstore.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    @Schema(description = "The account's name", example = "John Doe")
    private String name;
    @Schema(description = "The account's email", example = "tvhson@gmail.com")
    private String email;
    @Schema(description = "The account's password", example = "123456")
    private String password;
}
