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

$query;
// Function to calculate the total renewable energy supplied by all producers
export function calculateTotalRenewableEnergy(): string {
  const producers = producerStorage.values();
  if (producers.length === 0) {
    return "No producers found";
  }

  const totalRenewableEnergy = producers.reduce((total, producer) => {
    return total + parseFloat(producer.renewable_energy_supply);
  }, 0);

  return `Total Renewable Energy Supply: ${totalRenewableEnergy}`;
}

$query;
// Function to get a list of unfulfilled credit orders
export function getUnfulfilledCreditOrders(): Result<Vec<CreditOrder>, string> {
  const unfulfilledOrders = creditOrderStorage.values().filter(order => !order.is_fulfilled);
  
  if (unfulfilledOrders.length === 0) {
    return Result.Err("No unfulfilled credit orders found");
  }

  return Result.Ok(unfulfilledOrders);
}

$query;
// Function to get the total revenue generated from fulfilled credit orders
export function getTotalRevenue(): Result<number, string> {
  const fulfilledOrders = creditOrderStorage.values().filter(order => order.is_fulfilled);
  
  if (fulfilledOrders.length === 0) {
    return Result.Err("No fulfilled credit orders found");
  }

  const totalRevenue = fulfilledOrders.reduce((total, order) => {
    return total + (parseFloat(order.bid_price) * parseFloat(order.quantity));
  }, 0);

  return Result.Ok(totalRevenue);
}

$query;
// Function to get the list of contracts for a specific client
export function getClientContracts(client_id: string): Result<Vec<Contract>, string> {
  const clientContracts = contractStorage.values().filter(contract => contract.client_id === client_id);
  
  if (clientContracts.length === 0) {
    return Result.Err("No contracts found for the specified client");
  }

  return Result.Ok(clientContracts);
}

// Function to update credit order fulfillment status based on renewable energy supply
$update;
export function updateCreditOrderFulfillment(): string {
  const producers = producerStorage.values();
  const unfulfilledOrders = creditOrderStorage.values().filter(order => !order.is_fulfilled);

  if (producers.length === 0 || unfulfilledOrders.length === 0) {
    return "No producers or unfulfilled credit orders found";
  }

  // Assume a simple allocation strategy: fulfill orders as long as there is enough renewable energy supply
  for (const producer of producers) {
    let remainingEnergy = parseFloat(producer.renewable_energy_supply);

    for (const order of unfulfilledOrders) {
      const requiredEnergy = parseFloat(order.quantity);

      if (remainingEnergy >= requiredEnergy) {
        order.is_fulfilled = true;
        order.updated_at = Opt.Some(ic.time());
        creditOrderStorage.insert(order.id, order);

        remainingEnergy -= requiredEnergy;
      }
    }
  }

  return "Credit order fulfillment updated based on renewable energy supply";
}

type RenewableEnergySource = Record<{
  id: string;
  source_name: string;
  capacity: string;
  created_date: nat64;
  updated_at: Opt<nat64>;
}>;

const energySourceStorage = new StableBTreeMap<string, RenewableEnergySource>(4, 44, 512);

$update;
export function addRenewableEnergySource(source_name: string, capacity: string): string {
  const energySource = {
    id: uuidv4(),
    source_name: source_name,
    capacity: capacity,
    created_date: ic.time(),
    updated_at: Opt.None,
  };
  energySourceStorage.insert(energySource.id, energySource);
  return energySource.id;
}

$query;
// Function to get information about renewable energy sources
export function getRenewableEnergySources(): Result<Vec<RenewableEnergySource>, string> {
  const energySources = energySourceStorage.values();
  if (energySources.length === 0) {
    return Result.Err("No renewable energy sources found");
  }
  return Result.Ok(energySources);
}

// Function to get information about a specific renewable energy source by ID
$query;
export function getRenewableEnergySourceById(id: string): Result<RenewableEnergySource, string> {
  const energySource = match(energySourceStorage.get(id), {
    Some: (source) => source,
    None: () => ({} as unknown as RenewableEnergySource),
  });

  if (energySource.id) {
    return Result.Ok(energySource);
  }

  return Result.Err("Renewable energy source not found");
}

$update;
// Function to update information about a renewable energy source
export function updateRenewableEnergySource(id: string, source_name: string, capacity: string): string {
  const existingSource = match(energySourceStorage.get(id), {
    Some: (source) => source,
    None: () => ({} as unknown as RenewableEnergySource),
  });

  if (existingSource.id) {
    existingSource.source_name = source_name;
    existingSource.capacity = capacity;
    existingSource.updated_at = Opt.Some(ic.time());
    energySourceStorage.insert(existingSource.id, existingSource);
    return existingSource.id;
  }

  return "Renewable energy source not found";
}

$update;
// Function to delete a renewable energy source
export function deleteRenewableEnergySource(id: string): string {
  const existingSource = match(energySourceStorage.get(id), {
    Some: (source) => source,
    None: () => ({} as unknown as RenewableEnergySource),
  });

  if (existingSource.id) {
    energySourceStorage.remove(id);
    return `Renewable energy source with ID: ${id} removed successfully`;
  }

  return "Renewable energy source not found";
}

// Function to transfer renewable energy credits from one client to another
$update;
export function transferCredits(fromClientID: string, toClientID: string, quantity: string): string {
  const fromClient = match(clientStorage.get(fromClientID), {
    Some: (client) => client,
    None: () => ({} as unknown as Client),
  });

  const toClient = match(clientStorage.get(toClientID), {
    Some: (client) => client,
    None: () => ({} as unknown as Client),
  });

  if (!fromClient.id || !toClient.id) {
    return "Invalid client IDs";
  }

  const transferQuantity = parseFloat(quantity);
  if (isNaN(transferQuantity) || transferQuantity <= 0) {
    return "Invalid quantity for credit transfer";
  }

  const fromClientOrders = creditOrderStorage.values().filter(order => order.client_id === fromClientID && order.is_fulfilled);
  const totalFulfilledQuantity = fromClientOrders.reduce((total, order) => total + parseFloat(order.quantity), 0);

  if (totalFulfilledQuantity < transferQuantity) {
    return "Insufficient fulfilled credits for transfer";
  }

  // Deduct transferred quantity from fulfilled orders of the 'from' client
  let remainingTransferQuantity = transferQuantity;
  for (const order of fromClientOrders) {
    const orderQuantity = parseFloat(order.quantity);
    if (orderQuantity <= remainingTransferQuantity) {
      order.is_fulfilled = false;
      order.updated_at = Opt.Some(ic.time());
      creditOrderStorage.insert(order.id, order);
      remainingTransferQuantity -= orderQuantity;
    } else {
      order.quantity = (orderQuantity - remainingTransferQuantity).toString();
      order.updated_at = Opt.Some(ic.time());
      creditOrderStorage.insert(order.id, order);
      remainingTransferQuantity = 0;
      break;
    }
  }

  // Create a new credit order for the 'to' client
  const newCreditOrder = {
    id: uuidv4(),
    client_id: toClientID,
    quantity: quantity,
    bid_price: "0", // Set bid price to 0 for transferred credits
    is_fulfilled: true,
    created_date: ic.time(),
    updated_at: Opt.Some(ic.time()),
  };
  creditOrderStorage.insert(newCreditOrder.id, newCreditOrder);

  return `Successfully transferred ${quantity} renewable energy credits from ${fromClient.name} to ${toClient.name}`;
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
