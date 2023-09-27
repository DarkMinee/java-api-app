# javaApiApp

Applicazione generata utilizzando JHipster 7.9.4 che simula la struttura di una scuola elementare

## Sviluppo

- NOTA: La definizione delle entità si trova all'interno del file jhipster-jdl.jdl nella root directory del progetto

E' necessario installare node js ed eseguire nella cartella del progetto il comando

```
npm install
```

Infine per avviare questo comando

```
mvnw
```

---

## Build per la produzione

#### JAR

PEr compilare il progetto in un jar utilizzare il comando

```
./mvnw -Pprod clean verify
```

## Tests

Per eseguire dei test sul progetto client utilizzare il comando

```
npm test
```
