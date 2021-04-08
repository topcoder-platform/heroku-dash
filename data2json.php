<?php

	// provisional
	$csv = array_map('str_getcsv', file('./data/raw/DNAGraphData-fixed.csv') );
	$data = array();
	
	if ( $csv ) {
		foreach( $csv as $k=>$v ) {
			
			if ( ! array_key_exists($v[0], $data) ) {
				$data[$v[0]]['user'] = array(
					'handle'	=> $v[0],
					'rating'	=> $v[1],
					'country'	=> $v[2],
					'avatar'	=> $v[3]
				);
			}
			
			$data[$v[0]]['data'][] = array(
				'date'	=> $v[5],
				'score' => $v[4] // score in million
			);
		}
	}	

	echo '<pre>';
	echo json_encode( array_values($data), JSON_PRETTY_PRINT );
	echo '</pre>';
	
	
	echo '<hr />';
	
	
	// final
	$final_csv 	= array_map('str_getcsv', file('./data/raw/DNASubmissions.csv') );
	$final_data = array();

	if ( $final_csv ) {
		foreach( $final_csv as $k=>$v ) {
			
			if ( ! array_key_exists($v[0], $final_data) ) {
				$final_data[$v[0]]['user'] = array(
					'handle'	=> $v[0],
					'rating'	=> $v[1],
					'country'	=> $v[2],
					'avatar'	=> $v[3]
				);
			}
			
			$final_data[$v[0]]['data'][] = array(
				'date'	=> $v[5],
				'score' => $v[7]
			);
		}
	}
	

	echo '<pre>';
	echo json_encode( array_values($final_data), JSON_PRETTY_PRINT );
	echo '</pre>';
	
?>