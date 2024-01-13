// Importing necessary modules from the 'azle' library and 'uuid' library
import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, Principal } from 'azle';
import { v4 as uuidv4 } from "uuid";

// Defining record types for different entities
type Producer = Record<{
  id: string;
  name: string;
  renewable_energy_supply: string;
  created_date: nat64;
  updated_at: Opt<nat64>;
}>;

type Client = Record<{
  id: string;
  name: string;
  created_date: nat64;
  updated_at: Opt<nat64>;
}>;

type Contract = Record<{
  id: string;
  producer_id: string;
  client_id: string;
  quantity: string;
  price: string;
  created_date: nat64;
  updated_at: Opt<nat64>;
}>;

type CreditOrder = Record<{
  id: string;
  client_id: string;
  quantity: string;
  bid_price: string;
  is_fulfilled: boolean;
  created_date: nat64;
  updated_at: Opt<nat64>;
}>;

type CreditResponse = Record<{
  msg: string;
  total_price: number;
}>;

// Creating instances of StableBTreeMap for each entity type
const producerStorage = new StableBTreeMap<string, Producer>(0, 44, 512);
const clientStorage = new StableBTreeMap<string, Client>(1, 44, 512);
const contractStorage = new StableBTreeMap<string, Contract>(2, 44, 512);
const creditOrderStorage = new StableBTreeMap<string, CreditOrder>(3, 44, 512);

// Initialization of the Renewable Energy Credit Management System
$update;
export function initRenewableEnergyCreditSystem(): string {
  if (!producerStorage.isEmpty() || !clientStorage.isEmpty() || !contractStorage.isEmpty() || !creditOrderStorage.isEmpty()) {
    return `Renewable Energy Credit Management System has already been initialized`;
  }

  // Initialize default producer
  const producer = {
    id: uuidv4(),
    name: "Default Producer",
    renewable_energy_supply: "1000", // Default renewable energy supply
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  producerStorage.insert(producer.id, producer);

  // Initialize default client
  const client = {
    id: uuidv4(),
    name: "Default Client",
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  clientStorage.insert(client.id, client);

  return `Renewable Energy Credit Management System initialized with default producer and client`;
}

$query;
// Function to get information about producers
export function getProducers(): Result<Vec<Producer>, string> {
  const producers = producerStorage.values();
  if (producers.length === 0) {
    return Result.Err("No producers found");
  }
  return Result.Ok(producers);
}

$query;
// Function to get information about clients
export function getClients(): Result<Vec<Client>, string> {
  const clients = clientStorage.values();
  if (clients.length === 0) {
    return Result.Err("No clients found");
  }
  return Result.Ok(clients);
}

$query;
// Function to get information about contracts
export function getContracts(): Result<Vec<Contract>, string> {
  const contracts = contractStorage.values();
  if (contracts.length === 0) {
    return Result.Err("No contracts found");
  }
  return Result.Ok(contracts);
}

$query;
// Function to get information about credit orders
export function getCreditOrders(): Result<Vec<CreditOrder>, string> {
  const creditOrders = creditOrderStorage.values();
  if (creditOrders.length === 0) {
    return Result.Err("No credit orders found");
  }
  return Result.Ok(creditOrders);
}

// Function to add a new producer
$update;
export function addProducer(name: string, renewable_energy_supply: string): string {
  const producer = {
    id: uuidv4(),
    name: name,
    renewable_energy_supply: renewable_energy_supply,
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  producerStorage.insert(producer.id, producer);
  return producer.id;
}

// Function to add a new client
$update;
export function addClient(name: string): string {
  const client = {
    id: uuidv4(),
    name: name,
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  clientStorage.insert(client.id, client);
  return client.id;
}

// Function to initiate a contract between a producer and a client
$update;
export function initiateContract(producer_id: string, client_id: string, quantity: string, price: string): string {
  const contract = {
    id: uuidv4(),
    producer_id: producer_id,
    client_id: client_id,
    quantity: quantity,
    price: price,
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  contractStorage.insert(contract.id, contract);
  return contract.id;
}

// Function to place a credit order by a client
$update;
export function placeCreditOrder(client_id: string, quantity: string, bid_price: string): CreditResponse {
  const producer = producerStorage.values()[0]; // For simplicity, assume there is only one producer
  if (!producer) {
    return {
      msg: "No producers available",
      total_price: 0,
    };
  }

  const creditOrder = {
    id: uuidv4(),
    client_id: client_id,
    quantity: quantity,
    bid_price: bid_price,
    is_fulfilled: false,
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  creditOrderStorage.insert(creditOrder.id, creditOrder);

  const total_price = parseFloat(bid_price) * parseFloat(quantity);
  return {
    msg: `Credit order placed successfully. Total Price: $${total_price}`,
    total_price: total_price,
  };
}

// Function to fulfill a credit order by a producer
$update;
export function fulfillCreditOrder(credit_order_id: string): string {
  const creditOrder = match(creditOrderStorage.get(credit_order_id), {
    Some: (creditOrder) => creditOrder,
    None: () => ({} as unknown as CreditOrder),
  });

  if (creditOrder.is_fulfilled) {
    return `Credit order with ID: ${credit_order_id} is already fulfilled`;
  }

  creditOrder.is_fulfilled = true;
  creditOrder.updated_at = Opt.Some(ic.time());
  creditOrderStorage.insert(credit_order_id, creditOrder);

  return `Credit order with ID: ${credit_order_id} fulfilled successfully`;
}

// Function to update producer information
$update;
export function updateProducer(id: string, name: string, renewable_energy_supply: string): string {
  const existingProducer = match(producerStorage.get(id), {
    Some: (producer) => producer,
    None: () => ({} as unknown as Producer),
  });

  if (existingProducer.id) {
    existingProducer.name = name;
    existingProducer.renewable_energy_supply = renewable_energy_supply;
    existingProducer.updated_at = Opt.Some(ic.time());
    producerStorage.insert(existingProducer.id, existingProducer);
    return existingProducer.id;
  }

  return "Producer not found";
}

// Function to update client information
$update;
export function updateClient(id: string, name: string): string {
  const existingClient = match(clientStorage.get(id), {
    Some: (client) => client,
    None: () => ({} as unknown as Client),
  });

  if (existingClient.id) {
    existingClient.name = name;
    existingClient.updated_at = Opt.Some(ic.time());
    clientStorage.insert(existingClient.id, existingClient);
    return existingClient.id;
  }

  return "Client not found";
}

// Function to update contract information
$update;
export function updateContract(id: string, quantity: string, price: string): string {
  const existingContract = match(contractStorage.get(id), {
    Some: (contract) => contract,
    None: () => ({} as unknown as Contract),
  });

  if (existingContract.id) {
    existingContract.quantity = quantity;
    existingContract.price = price;
    existingContract.updated_at = Opt.Some(ic.time());
    contractStorage.insert(existingContract.id, existingContract);
    return existingContract.id;
  }

  return "Contract not found";
}

// Function to update credit order information
$update;
export function updateCreditOrder(id: string, quantity: string, bid_price: string): string {
  const existingCreditOrder = match(creditOrderStorage.get(id), {
    Some: (creditOrder) => creditOrder,
    None: () => ({} as unknown as CreditOrder),
  });

  if (existingCreditOrder.id) {
    existingCreditOrder.quantity = quantity;
    existingCreditOrder.bid_price = bid_price;
    existingCreditOrder.updated_at = Opt.Some(ic.time());
    creditOrderStorage.insert(existingCreditOrder.id, existingCreditOrder);
    return existingCreditOrder.id;
  }

  return "Credit order not found";
}

// Function to delete producer
$update;
export function deleteProducer(id: string): string {
  const existingProducer = match(producerStorage.get(id), {
    Some: (producer) => producer,
    None: () => ({} as unknown as Producer),
  });

  if (existingProducer.id) {
    producerStorage.remove(id);
    return `Producer with ID: ${id} removed successfully`;
  }

  return "Producer not found";
}

// Function to delete client
$update;
export function deleteClient(id: string): string {
  const existingClient = match(clientStorage.get(id), {
    Some: (client) => client,
    None: () => ({} as unknown as Client),
  });

  if (existingClient.id) {
    clientStorage.remove(id);
    return `Client with ID: ${id} removed successfully`;
  }

  return "Client not found";
}

// Function to delete contract
$update;
export function deleteContract(id: string): string {
  const existingContract = match(contractStorage.get(id), {
    Some: (contract) => contract,
    None: () => ({} as unknown as Contract),
  });

  if (existingContract.id) {
    contractStorage.remove(id);
    return `Contract with ID: ${id} removed successfully`;
  }

  return "Contract not found";
}

// Function to delete credit order
$update;
export function deleteCreditOrder(id: string): string {
  const existingCreditOrder = match(creditOrderStorage.get(id), {
    Some: (creditOrder) => creditOrder,
    None: () => ({} as unknown as CreditOrder),
  });

  if (existingCreditOrder.id) {
    creditOrderStorage.remove(id);
    return `Credit order with ID: ${id} removed successfully`;
  }

  return "Credit order not found";
}

// Mocking the 'crypto' object for testing purposes
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
