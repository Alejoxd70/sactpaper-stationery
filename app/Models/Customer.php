<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'document_type',
        'document_number',
        'email',
        'phone',
        'address',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function getTotalPurchases()
    {
        return $this->invoices()->sum('total');
    }

    public function getPendingBalance()
    {
        return $this->invoices()->where('payment_status', 'pending')->sum('total');
    }
}
