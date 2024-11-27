export enum UserRole {
    Customer = 'customer',
    Admin = 'admin',
    JuniorAdmin = 'juniorAdmin',
    StoreOwner = 'storeOwner',
    Manager = 'manager',
    DeliveryPartner = 'deliveryPartner'
}

export enum ActionTakers {
    User = 'user',
    Admin = 'admin',
    Store = 'store',
    DeliveryPartner = 'deliveryPartner'
};

export enum OrderType {
   Prepaid = 'prepaid',
   Postpaid = 'postpaid',
   Gift = 'gift'
};

export enum OrderStatus {
    Created = 'created',
    Pending = 'pending',
    Reviewing = 'reviewing',
    Accepted = 'accepted',
    Processing = 'processing',
    Reaching = 'reaching',
    Cancelled = 'cancelled'
};

export enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
    Refunded = 'refunded',
};

export enum MeasureType {
    KG= 'kg',
    G= 'g',
    L= 'l',
    ML= 'ml',
    PCS= 'pcs',
    PACK= 'pack'
}