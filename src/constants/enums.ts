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
    Cancelled = 'cancelled',
    Delivered = 'delivered'
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

export enum OTPpurpose {
    SIGNUP= 'signup',
    LOGIN= 'login',
    PASSWORD_RESET= 'password_reset'
}

export enum UserFinds {
    GOOD= 'good',
    NEUTRAL= 'neutral',
    BAD= 'bad'
}

export enum RatingPointer {
    Half = "0.5",
    One = "1.0",
    OneAndHalf = "1.5",
    Two = "2.0",
    TwoAndHalf = "2.5",
    Three = "3.0",
    ThreeAndHalf = "3.5",
    Four = "4.0",
    FourAndHalf = "4.5",
    Five = "5.0",
  }

export enum Arrived {
    LATE= "late",
    PUNCTUAL= "punctual",
    EARLY= "early"
  }

// Enum for UserAction
export enum UserAction {
    CLICKED = 'clicked',
    ORDERED = 'ordered',
    CANCELLED = 'cancelled',
    FAVOURITE_ADDED = 'favouriteAdded',
    REMOVED_FROM_FAVOURITE = 'removedFromFavourite',
    ADDED_TO_CART = 'addedToCart',
    REMOVED_FROM_CART = 'removedFromCart',
    CHANGED_DETAILS = 'changedDetails',
    NOTIFY = 'notify',
    DE_NOTIFY = 'deNotify',
    PRODUCT_LISTED = 'productListed',
    STORE_LISTED = 'storeListed',
    PRODUCT_UPDATED = 'productUpdated',
    STORE_UPDATED = 'storeUpdated',
    REVIEWED = 'reviewed',
}
  