<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Traits\HasRoles;
use App\Helpers\Equivalencias;
use Illuminate\Database\Eloquent\Model;
use App\Models\PersonaCentralizado;
use App\Models\AplicativoUsuario;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Models\GDDependency;
use App\Models\Regional;

class User extends Authenticatable implements JWTSubject
{
    use HasRoles,Notifiable,HasFactory, SoftDeletes;


    protected $table = "usuarios";


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona', 'id');
    }

    public function aplicativos()
    {
        return $this->hasMany(AplicativoUsuario::class, 'id_usuario');
    }

    /**
     * Relación con Roles (usando el modelo Role)
     */
    public function rolesModel()
    {
        return $this->belongsToMany(
            Rol::class,
            'model_has_roles',  // Tabla pivot (ModelHasRoles)
            'model_id',         // Llave foránea en la tabla pivot
            'role_id',          // Llave foránea de roles
            'id',               // Llave primaria del usuario
            'id'                // Llave primaria del rol
        )->where('model_type', self::class); // Filtrar por tipo de modelo
    }

    public function dependency()
    {
        return $this->belongsTo(GDDependency::class, 'dependency_id');
    }

    public function charge()
    {
        return $this->belongsTo(Charge::class, 'charge_id');
    }

    public function regional()
    {
        return $this->belongsTo(Regional::class, 'regional_id');
    }

    public function getAllPermissionsAttribute()
    {
        $permissions = [];

        if (Auth::user()->super_administrador == '0' and session('conexion') != 'centralizado') {
            foreach (Permission::where('status', 1)->get() as $permission) {
                if (Auth::user()->can($permission->name)) {
                    $permissions[] = $permission->name;
                }
            }
        } else if (Auth::user()->super_administrador == '1' and session('conexion') != 'centralizado') {
            foreach (Permission::where('status', 1)->get() as $permission) {
                $permissions[] = $permission->name;
            }
            // Auth::user()->assignRole('Super administrador');
        }
        return $permissions;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class, 'tipo_documento', 'id');
    }
    public function getRolesConcatenadosAttribute()
    {
        return $this->rolesModel()->pluck('name')->implode(' - ');
    }
}
