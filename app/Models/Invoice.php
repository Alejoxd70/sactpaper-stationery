<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'user_id',
        'customer_id',
        'invoice_number',
        'date',
        'due_date',
        'subtotal',
        'tax',
        'discount',
        'total',
        'payment_status',
        'payment_method',
        'notes',
    ];

    protected $casts = [
        'date' => 'datetime',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // payment_status: pending, partial, paid
    // payment_method: cash, card, transfer, credit

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }

    public function calculateTotals()
    {
        $subtotal = (float) $this->items->sum(fn($item) => $item->quantity * $item->unit_price);
        $tax = $subtotal * 0.19; // IVA 19%
        $total = $subtotal + $tax - (float) ($this->discount ?? 0);
        
        $this->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
        ]);
    }
}
