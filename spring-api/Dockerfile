#------PHASE 1 CONSTRUCTION------
FROM gradle:8.4-jdk17 AS build

COPY --chown=gradle:gradle . /app

WORKDIR /app    

RUN ./gradlew build --no-daemon

#------PHASE 2: FINAL IMAGE------
FROM eclipse-temurin:17-jdk

WORKDIR /app 

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

