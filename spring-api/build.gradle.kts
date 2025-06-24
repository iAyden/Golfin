plugins {
	java
	id("org.springframework.boot") version "3.4.5"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.golfin"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation ("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb") 
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	add("developmentOnly", "org.springframework.boot:spring-boot-devtools")
	implementation("org.springframework.security:spring-security-crypto")
	implementation("jakarta.validation:jakarta.validation-api:3.0.2")
	implementation ("org.hibernate.validator:hibernate-validator:8.0.1.Final")
	implementation ("org.glassfish:jakarta.el:4.0.2")
	//implementation ("org.springframework.boot:spring-boot-starter-oauth2-client")
	//implementation ("org.springframework.boot:spring-boot-starter-oauth2-resource-server")


}

tasks.withType<Test> {
	useJUnitPlatform()
}
