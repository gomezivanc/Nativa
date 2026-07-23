<?php
namespace App\Helpers;

class Equivalencias
{

	// private static $urlProduccion = 'localhost:8000/';
	// private static $urlProduccion = 'https://centralizada.nygsoft.com/';


	public static function urlProduccion()
	{
		return env('APP_URL');
	}

	// public static function urlDinamico()
	// {
	// 	// return env('APP_URL')."super_bien/sime-nuevo/public/";
	// 	return self::$urlDinamico;
	// }

}
