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
	implementation("com.google.api-client:google-api-client:1.34.1")
    implementation("com.google.oauth-client:google-oauth-client-jetty:1.34.1")
	implementation("com.google.http-client:google-http-client-jackson2:1.41.5")
    implementation("com.google.http-client:google-http-client-gson:1.42.3")
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")
	implementation("io.github.cdimascio:dotenv-java:3.0.0")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
