<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Helper\Html;
// --- Render Images
use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing;

/**
 * Servicio para generar Excel
 *
 * Esta clase extiende Spreadsheet y agrega funcionalidades nuevas
 * para optimizar el trabajo del desarrollador
 *
 * @author Nestor Alejandro Quintero <alejoquintecar@gmail.com>
 * @version 1.0
 * @link https://phpspreadsheet.readthedocs.io/en/latest/
 * 
 */
class ExcelService extends Spreadsheet{

  /**
   * Array con estilos por defecto para titulos
   *
   * @var array
   */
  private $aTitleStyle = array(
    'font' => ['name' => 'Arial', 'bold' => true, 'size' => 12, 'color' => array('rgb'=>'FFFFFF') ],
    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
    'fill' => ['fillType' => 'solid', 'startColor' => ['argb' => '283C5E']]
  );

  /**
   * Array con estilos por defecto para subtitulos
   *
   * @var array
   */
  private $aSubTitleStyle = array(
    'font' => ['name' => 'Arial', 'bold' => true, 'size' => 11 ],
    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
    'fill' => ['fillType' => 'solid', 'startColor' => ['argb' => 'F1F4F9']]
  ); // 'alignment'=>['wrapText'=>true] --- 'font' => ['color'=>array('rgb'=>'FFFFFF')]

  /**
   * Array con estilos por defecto para texto
   *
   * @var array
   */
  private $aTextStyle = array(
    'font' => ['name' => 'Arial', 'bold' => false, 'size' => 10],
    'alignment' => ['horizontal' => 'left', 'vertical' => 'center', 'wrapText' => true]
  );

  /**
   * Array con estilos por defecto para texto
   *
   * @var array
   */
  private $aImageStyle = [ 'width' => 120, 'height' => 120, 'priority' => 'h' ];

  /**
   * Array con el alfabeto para calculo de columna automatico
   *
   * @var array
   */
  private $aAlphabet = array(
    1  => 'A', 2  => 'B', 3  => 'C', 4  => 'D', 5  => 'E', 6  => 'F', 7  => 'G',
    8  => 'H', 9  => 'I', 10 => 'J', 11 => 'K', 12 => 'L', 13 => 'M', 14 => 'N',
    15 => 'O', 16 => 'P', 17 => 'Q', 18 => 'R', 19 => 'S', 20 => 'T', 21 => 'U',
    22 => 'V', 23 => 'W', 24 => 'X', 25 => 'Y', 26 => 'Z'
  );

  /**
   * String con imagen por defecto en caso de que no se encuentre la imagen enviada
   *
   * @var string
   */
  public $sPathImageDefault = '';

  /**
   * String con imagen por defecto en caso de que no se encuentre la imagen enviada
   *
   * @var string
   */
  public $sPathImageNotFound = '';

  /**
   * Object con el servicio de utilidades.
   *
   * @var object
   */
  public $oUtilities = null;

  /**
   * Hoja Activa Spreadsheet
   *
   * @var object
   */
  public $oSheetActive = null;

  /**
   * Objeto Helper|Html para imprimir HTML en Excel
   *
   * @var object
   */
  public $oHelperHtml = null;

  /**
   * Objeto MemoryDrawing para imprimir Imagen en Excel
   *
   * @var object
   */
  private $oMemoryDrawing = null;

  /**
   * Cree una nueva PhpSpreadsheet con una hoja de trabajo.
   * 
   * Iniciar las variables por defecto que require el desarrollador.
   */
  function __construct(){
    parent::__construct();
    // $this->setSheetActiveXlsx(0);
  }

  /**
   * Ajustar margenes de la hoja
   *
   * @access public
   * @param float $nTop     margen Top
   * @param float $nRight   margen Right
   * @param float $nBottom  margen Bottom
   * @param float $nLeft    margen Left
   *
   * @author Nestor Alejandro Quintero (alejoquintecar@gmail.com)
   */
  public function setSheetMargins( float $dLeft = 0, float $dTop = 0, float $dRight = 0, float $dBottom = 0 ){
    if ( $dLeft   != 0 ) $this->oSheetActive->getPageMargins()->setLeft($dLeft);
    if ( $dTop    != 0 ) $this->oSheetActive->getPageMargins()->setTop($dTop);
    if ( $dRight  != 0 ) $this->oSheetActive->getPageMargins()->setRight($dRight);
    if ( $dBottom != 0 ) $this->oSheetActive->getPageMargins()->setBottom($dBottom);
  }

  /**
   * Ajustar el alto de una fila en el Excel
   * 
   * @access public
   * 
   * @param int $nRow Numero de fila
   * @param float $dHeight Alto a asignar a la fila
   * 
   * @author Nestor Alejandro Quintero (alejoquintecar@gmail.com)
   */
  public function setRowHeight( int $nRow, float $dHeight ){
    $this->oSheetActive->getRowDimension($nRow)->setRowHeight($dHeight);
  }

  /**
   * Ajustar el alto de una fila en el Excel
   * 
   * @access public
   * 
   * @param string $sColumn Columna
   * @param float $dWidth Ancho a asignar a la columna
   * 
   * @author Nestor Alejandro Quintero (alejoquintecar@gmail.com)
   */
  public function setSheetColumnWidth( string $sColumn, float $dWidth ){
    $this->oSheetActive->getColumnDimension($sColumn)->setWidth($dWidth);
  }

  /**
   * Imprimir Html en Excel
   * 
   * @access public
   * 
   * @param string $sHtml Html a imprimir
   * @param string $sCell Columna y fila a imprimir el Html ('A1')
   * @param string $sMergeCells Rango de celdas a combinar ('A1:C2')
   * 
   * @author Nestor Alejandro Quintero (alejoquintecar@gmail.com)
   */
  public function setSheetHtml( string $sHtml, string $sCell, string $sMergeCells = '' ){
    if( $this->oHelperHtml == null ) $this->oHelperHtml = new Html();
    $oHtml = $this->oHelperHtml->toRichTextObject($sHtml);
    $this->oSheetActive->setCellValue($sCell, $oHtml);
    if ($sMergeCells != '') $this->oSheetActive->mergeCells($sMergeCells);
  }

  /**
   * Metodo imprimir imagenes en excel
   * 
   * @param array  $aPaddingXY Espaciado horizontal y vertical de la imagen
   * @param string $sCell Celda donde se va a imprimir
   * @param array  $aImageXY dimencion imagen, si no lo envia se toman los valores del recurso.
   * 
   * @author Nestor Alejandro Quintero (alejoquintecar@gmail.com)
   */
  public function setSheetImageCell( array $aImageParams, string $sCell = '', array $aPaddingXY = [] ){

    $sRouteFile = $aImageParams['path'];
    if( !file_exists($sRouteFile) || pathinfo($sRouteFile, PATHINFO_EXTENSION) === "" ){
      $sRouteFile = $this->sPathImageDefault;
    }
    $sImageFileExt = pathinfo($sRouteFile, PATHINFO_EXTENSION);
    $oImageFile = NULL;
    switch( $sImageFileExt ){
      case 'jpg': $oImageFile = @imagecreatefromjpeg($sRouteFile); break;
      case 'png': $oImageFile = @imagecreatefrompng($sRouteFile); break;
    }
    // dd( 1212 );
    // dd( $sRouteFile, file_exists($sRouteFile), file_get_contents($sRouteFile), $sImageFileExt );

    $oImageFileResized = NULL;
    $bRedimensionar = (isset($aImageParams['redimensionar']) && $aImageParams['redimensionar']) ? TRUE : FALSE;
    if( $bRedimensionar ){
      $aRedimensionar = $this->aImageStyle;
      if( gettype($aImageParams['redimensionar']) == 'array'){
        $aImageRedimensionar = $aImageParams['redimensionar'];
        // Asignar dimenciones
        if(isset($aImageRedimensionar['width'])) $aRedimensionar['width'] = $aImageRedimensionar['redimensionar'];
        if(isset($aImageRedimensionar['height'])) $aRedimensionar['height'] = $aImageRedimensionar['redimensionar'];
        // Validar prioridad
        if(isset($aImageRedimensionar['priority'])) $aRedimensionar['priority'] = $aImageRedimensionar['priority'];
        else{
          if( isset($aImageRedimensionar['width']) && isset($aImageRedimensionar['height']) ) $aRedimensionar['priority'] = FALSE;
          else{
            if( isset($aImageRedimensionar['width']) ) $aRedimensionar['priority'] = 'w';
            if( isset($aImageRedimensionar['height']) ) $aRedimensionar['priority'] = 'h';
          }
        }
      }

      $aDimensionesOriginales = getimagesize($sRouteFile);
      $aHeightOriginal = $aDimensionesOriginales[1];
      $aWidthOriginal = $aDimensionesOriginales[0];
      // Alto - Calcula el factor de escala
      if( $aRedimensionar['priority'] == 'h' && $aHeightOriginal > $aRedimensionar['height']){
        $dFactorEscala = $aRedimensionar['height'] / $aHeightOriginal;
      }
      // Ancho - Calcula el factor de escala
      if( $aRedimensionar['priority'] == 'w' && $aWidthOriginal > $aRedimensionar['width'] ){
        $dFactorEscala = $aRedimensionar['width'] / $aWidthOriginal;
      }
      // Calcula las nuevas dimensiones reducidas
      $nHeightNew = round($aHeightOriginal * $dFactorEscala);
      $nWidthNew  = round($aWidthOriginal * $dFactorEscala);
      $oImageFileResized = imagescale($oImageFile , $nWidthNew, $nHeightNew);
    }

    $this->oMemoryDrawing = new MemoryDrawing();
    $this->oMemoryDrawing->setName('Sample image');
    $this->oMemoryDrawing->setDescription('Sample image');
    $this->oMemoryDrawing->setImageResource($oImageFileResized);
    $this->oMemoryDrawing->setRenderingFunction(MemoryDrawing::RENDERING_PNG);
    $this->oMemoryDrawing->setMimeType(MemoryDrawing::MIMETYPE_DEFAULT);
    $this->oMemoryDrawing->setCoordinates($sCell);
    $this->oMemoryDrawing->setWorksheet($this->oSheetActive);
    unset($this->oMemoryDrawing);
  }

  /**
   * Metodo imprimir titulos en el excel
   * 
   * @param string  $sText Texto a imprimir
   * @param string  $sCell Celda imprimir texto ('A1')
   * @param array   $aStyles estilos a mezclar con los por defecto
   *
   * @author Nestor Alejandro Quintero (alejoquintecar@gmail.com)
   */
  public function setStyles( string $sTypeStyle = '', array $aStylesCustom = [], string $sCell, string $sText = '' ){
    $aStyles = [];
    switch( $sTypeStyle ){
      case 'title': $aStyles = $this->aTitleStyle; break;
      case 'subTitle': $aStyles = $this->aSubTitleStyle; break;
      case 'text': $aStyles = $this->aTextStyle; break;
    }

    // Si Los dos son nulos
    if( empty($sTypeStyle) && empty($aStylesCustom) ){
      $aStyles = $this->aTextStyle;
    }
    // Si ninguno es nulo
    if( !empty($sTypeStyle) && !empty($aStylesCustom) ){
      // $aStyles = $this->getMergeStyles($aStyles, $aStylesCustom);
    }

    if( !empty($sText) ){
      $this->oSheetActive->setCellValue($sCell, $sText);
    }
    $this->oSheetActive->getStyle($sCell)->applyFromArray($aStyles);

  }

  /**
   * Metodo imprimir texto en el excel
   * 
   * @param array $aDfColumnas Array con la configuracion de columnas
   * @param int   $nFila Fila para imprimir Header grilla
   * @param float $nRowHeight Alto de la fila
   * 
   * @author Nestor Alejandro Quintero (alejoquintecar@rayco.co)
   */
  public function applyStyles( array $aColumnsStyle ){
    foreach( $aColumnsStyle as $key => $aItemStyle ){
      $aStyle = [];
      $sCell = $aItemStyle['cell'];
      $nRowStart = (int)filter_var( $sCell, FILTER_SANITIZE_NUMBER_INT);

      if( $aItemStyle['merge'] == TRUE ){
        $aCell = explode(':', $sCell);
        $this->oSheetActive->mergeCells($sCell);
        $sCell = $aCell[0];
        $nRowStart = (int)filter_var($aCell[0], FILTER_SANITIZE_NUMBER_INT);
      }else if( str_contains($sCell, ':') ){
        $aCell = explode(':', $sCell);
        $nRowStart = (int)filter_var($aCell[0], FILTER_SANITIZE_NUMBER_INT);
      }
      // Text style
      if( isset($aItemStyle['height']) ){
        $this->setRowHeight($nRowStart, $aItemStyle['height'] );
      }
      // Estilos
      if( isset($aItemStyle['style']) ) $aStyle = $aItemStyle['style'];
      // Text style
      if( $aItemStyle['type'] == 'text' ){
        if( isset($aItemStyle['text']) ){
          $this->setStyles($aItemStyle['typeStyle'], $aStyle, $sCell, $aItemStyle['text'] );
        }else{
          $this->setStyles($aItemStyle['typeStyle'], $aStyle, $sCell);
        }
      }
      // Image style
      if( $aItemStyle['type'] == 'image' ){
        $this->setSheetImageCell($aItemStyle, $sCell, []);
      }
    }
  }

  // --- --- --- Utilidades --- --- ---

  /**
   * Metodo Obtener la columna a imprimir
   * 
   * @param int $nIndiceArray indice del array de definicion de columna
   * 
   * @author Nestor Alejandro Quintero (alejoquintecar@gmail.com)
   */
  public function getStrintColumna(int $nIndexArray){
    $sReturn = '';
    do{
      if( $nIndexArray > 26 ){
        $sReturn .= 'A';
        $nIndexArray = $nIndexArray - 26;
      }
      if( $nIndexArray <= 26 ) $sReturn .= $this->aAlphabet[$nIndexArray];
    } while ($nIndexArray > 26);
    return $sReturn;
  }

  /**
   * Metodo Obtener la columna a imprimir
   * 
   * @param int $nIndiceArray indice del array de definicion de columna
   * 
   * @author Nestor Alejandro Quintero (alejoquintecar@gmail.com)
   */
  public function getMergeStyles(array $aStyle, array $aStyleCustom){
    $resultado = array_merge($aStyle, $aStyleCustom);
    return;
  }

  // --- --- END Utilidades --- --- ---

}