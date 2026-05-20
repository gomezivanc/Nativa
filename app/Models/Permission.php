<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Session;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Permission extends \Spatie\Permission\Models\Permission
{
	use HasFactory, SoftDeletes, LogsActivity;

	protected $guarded = [];

	protected $guard_name = "web";

    protected static $logAttributes = ['*'];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['*']);
    }

    public function getLogNameToUse(string $eventName = ''): string
    {
        return 'Permisos';
    }

	public function __construct(array $attributes = [])
	{
		parent::__construct($attributes);

	}

	public function role_permissions()
	{
		return $this->hasOne(RolePermission::class, 'permission_id', 'permission.id');
	}


	public static function permisosAdministrador()
	{
		return [
			'1' => [
				'name_module' => 'Usuarios', // Nombre del módulo
				'permissions' => [
					'view_usuarios',
					'add_usuarios',
					'edit_usuarios',
					'delete_usuarios'
				]
			],
			'2' => [
				'name_module' => 'Roles', // Nombre del módulo
				'permissions' => [
					'view_roles',
					'add_roles',
					'edit_roles',
					'delete_roles'
				]
			],
			'3' => [
				'name_module' => 'Menús', // Nombre del módulo
				'permissions' => [
					'view_parametrizar_menus',
					'add_parametrizar_menus',
					'edit_parametrizar_menus',
					'delete_parametrizar_menus',
				]
			],
			'4' => [
				'name_module' => 'Permisos', // Nombre del módulo
				'permissions' => [
					'view_permisos',
					'add_permisos',
					'edit_permisos',
					'delete_permisos',
				]
			]
		];
	}
}
