FROM maven:3.9-eclipse-temurin-17

WORKDIR /gatling
COPY pom.xml .
RUN mvn dependency:resolve -q

COPY src src
RUN mvn test-compile -q

ENTRYPOINT ["mvn", "gatling:test"]
CMD ["-Dgatling.simulationClass=com.azamra.loadtest.simulations.SmokeSimulation"]
