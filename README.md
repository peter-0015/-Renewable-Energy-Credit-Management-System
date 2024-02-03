## Documentation for Renewable Energy Credit Management System

### Overview

The Renewable Energy Credit Management System is designed to facilitate the exchange of carbon credits between electricity producers and clients. The system enables the initiation of contracts, addition of clients and producers, and management of credit orders, creating a dynamic marketplace for carbon credits.

### Key Entities

1. **Producer**: Represents an electricity producer generating renewable energy. Producers earn credits proportional to their renewable energy supply.

   - **Attributes**:
     - `id`: Unique identifier for the producer.
     - `name`: Name of the producer.
     - `renewable_energy_supply`: Amount of renewable energy supplied by the producer.
     - `created_date`: Timestamp indicating when the producer was created.
     - `updated_at`: Optional timestamp for the last update.

2. **Client**: Represents a client interested in purchasing carbon credits.

   - **Attributes**:
     - `id`: Unique identifier for the client.
     - `name`: Name of the client.
     - `created_date`: Timestamp indicating when the client was created.
     - `updated_at`: Optional timestamp for the last update.

3. **Contract**: Represents a contractual agreement between a producer and a client, specifying the quantity and price of renewable energy credits.

   - **Attributes**:
     - `id`: Unique identifier for the contract.
     - `producer_id`: ID of the producer involved in the contract.
     - `client_id`: ID of the client involved in the contract.
     - `quantity`: Quantity of renewable energy credits in the contract.
     - `price`: Price of the credits in the contract.
     - `created_date`: Timestamp indicating when the contract was created.
     - `updated_at`: Optional timestamp for the last update.

4. **CreditOrder**: Represents an order placed by a client to purchase renewable energy credits. The order includes the quantity and bid price.

   - **Attributes**:
     - `id`: Unique identifier for the credit order.
     - `client_id`: ID of the client placing the order.
     - `quantity`: Quantity of renewable energy credits in the order.
     - `bid_price`: Bid price per credit in the order.
     - `is_fulfilled`: Indicates whether the order has been fulfilled.
     - `created_date`: Timestamp indicating when the order was created.
     - `updated_at`: Optional timestamp for the last update.

5. **CreditResponse**: Represents the response generated after placing a credit order. Includes a message and the total price of the order.

   - **Attributes**:
     - `msg`: A message providing information about the status of the credit order.
     - `total_price`: The total price of the credit order.

6. **RenewableEnergySource**: Represents a renewable energy source with properties like `id`, `source_name`, `capacity`, `created_date`, and `updated_at`.

### Operations

The system provides the following operations:

1. **Initialization**:
   - `initRenewableEnergyCreditSystem`: Initializes the system with a default producer and client.

2. **Query Operations**:
   - `getProducers`: Retrieves information about all producers.
   - `getClients`: Retrieves information about all clients.
   - `getContracts`: Retrieves information about all contracts.
   - `getCreditOrders`: Retrieves information about all credit orders.
   - `getRenewableEnergySources`: Retrieves information about all renewable energy sources.
   - `getRenewableEnergySourceById`: Retrieves information about a specific renewable energy source by ID.
   - `getUnfulfilledCreditOrders`: Retrieves a list of unfulfilled credit orders.
   - `getTotalRevenue`: Retrieves the total revenue generated from fulfilled credit orders.
   - `getClientContracts`: Retrieves the list of contracts for a specific client.

3. **Update Operations**:
   - `addProducer`: Adds a new producer to the system.
   - `addClient`: Adds a new client to the system.
   - `initiateContract`: Initiates a contract between a producer and a client.
   - `placeCreditOrder`: Places a credit order by a client.
   - `fulfillCreditOrder`: Fulfills a credit order by a producer.
   - `updateProducer`: Updates information about a producer.
   - `updateClient`: Updates information about a client.
   - `updateContract`: Updates information about a contract.
   - `updateCreditOrder`: Updates information about a credit order.
   - `deleteProducer`: Deletes a producer from the system.
   - `deleteClient`: Deletes a client from the system.
   - `deleteContract`: Deletes a contract from the system.
   - `deleteCreditOrder`: Deletes a credit order from the system.
   - `addRenewableEnergySource`: Adds a new renewable energy source.
   - `updateRenewableEnergySource`: Updates information about a renewable energy source.
   - `deleteRenewableEnergySource`: Deletes a renewable energy source from the system.
   - `transferCredits`: Transfers renewable energy credits from one client to another.
   - `updateCreditOrderFulfillment`: Updates credit order fulfillment based on renewable energy supply.

4. **Mocking for Testing**:
   - The code includes mocking of the 'crypto' object for testing purposes.

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/peter-0015/Renewable-Energy-Credit-Management-System.git
   cd Renewable-Energy-Credit-Management-System
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the IC local development environment

   ```bash
   dfx start --background --clean
   ```

4. Deploy the canisters to the local development environment

   ```bash
   dfx deploy
   ```