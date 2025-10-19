<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'category',
        'unit_price',
        'cost',
        'stock',
        'min_stock',
        'is_active',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'cost' => 'decimal:2',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'is_active' => 'boolean',
    ];

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function movements()
    {
        return $this->hasMany(InventoryMovement::class);
    }

    public function isLowStock()
    {
        return $this->stock <= $this->min_stock;
    }

    public function updateStock($quantity, $type = 'sale')
    {
        if ($type === 'sale' || $type === 'adjustment_out') {
            $this->stock -= $quantity;
        } else {
            $this->stock += $quantity;
        }
        $this->save();
    }
}
