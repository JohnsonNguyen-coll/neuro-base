module neurobase_addr::neurobase {
    use std::signer;
    use std::vector;
    use std::string::{String};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    /// Error Codes
    const E_PACK_NOT_FOUND: u64 = 3;
    const E_NOT_AUTHORIZED: u64 = 4;

    struct MemoryBlob has key, store, copy, drop {
        owner: address,
        blob_id: vector<u8>,
        price_per_read: u64,
        access_count: u64
    }

    /// A curated bundle of memories sold as a single unit or subscription
    struct MemoryPack has key, store, copy, drop {
        owner: address,
        pack_id: String,
        description: String,
        blobs: vector<vector<u8>>, // List of blob_ids included in the pack
        price: u64,
        metadata_uri: String,
        is_public: bool
    }

    struct Registry has key {
        blobs: vector<MemoryBlob>,
        packs: vector<MemoryPack>
    }

    #[event]
    struct MarketPurchaseEvent has drop, store {
        buyer: address,
        owner: address,
        pack_id: String,
        amount_paid: u64,
        timestamp: u64
    }

    public entry fun init_registry(account: &signer) {
        if (!exists<Registry>(signer::address_of(account))) {
            move_to(account, Registry {
                blobs: vector::empty<MemoryBlob>(),
                packs: vector::empty<MemoryPack>()
            });
        }
    }

    /// Create and publish a "Memory Pack" to the marketplace
    public entry fun create_pack(
        account: &signer,
        pack_id: String,
        description: String,
        blobs: vector<vector<u8>>,
        price: u64,
        metadata_uri: String
    ) acquires Registry {
        let addr = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(addr);
        
        let new_pack = MemoryPack {
            owner: addr,
            pack_id,
            description,
            blobs,
            price,
            metadata_uri,
            is_public: true
        };
        vector::push_back(&mut registry.packs, new_pack);
    }

    /// Purchase access to a curated Memory Pack
    public entry fun purchase_pack_access(
        buyer: &signer,
        owner_addr: address,
        pack_idx: u64
    ) acquires Registry {
        let registry = borrow_global_mut<Registry>(owner_addr);
        let pack = vector::borrow(&registry.packs, pack_idx);
        
        let amount = pack.price;
        coin::transfer<AptosCoin>(buyer, owner_addr, amount);
        
        // Emit marketplace event for verification
        event::emit(MarketPurchaseEvent {
            buyer: signer::address_of(buyer),
            owner: owner_addr,
            pack_id: *&pack.pack_id,
            amount_paid: amount,
            timestamp: timestamp::now_seconds(),
        });

        // NOTE: In a full NFT implementation, we would mint an Access NFT 
        // to the buyer here. For MVP, we use the on-chain Event as the receipt.
    }
}
