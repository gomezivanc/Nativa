<?php
namespace App\Helpers;

class Equivalencias
{

	// private static $urlProduccion = 'localhost:8000/';
	// private static $urlProduccion = 'https://centralizada.nygsoft.com/';


	public static function urlProduccion()
	{
		// return env('APP_URL')."super_bien/centralizado-sime/public/";
		return 'http://181.49.45.246:8085/cortolima/public/';
	}

	// public static function urlDinamico()
	// {
	// 	// return env('APP_URL')."super_bien/sime-nuevo/public/";
	// 	return self::$urlDinamico;
	// }

}
