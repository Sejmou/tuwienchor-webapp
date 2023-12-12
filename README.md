# Custom Data and Pipeline Dashboard
This is a custom data and pipeline dashboard built with SvelteKit. Currently, its purpose is triggering pipelines for data imports and anomaly score calculation in the SAD project and keeping an overview of what data exists already. It uses the mage.ai API to fetch data about the state of pipelines and jobs in our ETL system and also interacts with the ClickHouse DB via its HTTP interface.

TODO: document