<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = [
        'code',
        'name',
        'type',
        'parent_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Tipos: activo, pasivo, patrimonio, ingreso, gasto, costo
    public function parent()
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function getBalance()
    {
        $debits = $this->transactions()->sum('debit');
        $credits = $this->transactions()->sum('credit');
        
        return in_array($this->type, ['activo', 'gasto', 'costo']) 
            ? $debits - $credits 
            : $credits - $debits;
    }
}
