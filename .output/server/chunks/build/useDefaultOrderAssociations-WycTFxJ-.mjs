function useDefaultOrderAssociations() {
  const orderAssociations = {
    stateMachineState: {},
    lineItems: {
      associations: {
        cover: {},
        downloads: {
          associations: {
            media: {}
          }
        }
      }
    },
    addresses: {},
    deliveries: {
      associations: {
        shippingMethod: {},
        shippingOrderAddress: {},
        stateMachineState: {}
      }
    },
    transactions: {
      associations: {
        paymentMethod: {},
        stateMachineState: {}
      }
    }
  };
  return orderAssociations;
}

export { useDefaultOrderAssociations as u };
