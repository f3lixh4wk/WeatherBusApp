<?php
$stopPointRef = $_POST['stop'];
$deppArrTime = $_POST['time'];
$fileName = $_POST['fileName'];
//The XML string that you want to send.
$xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Trias version="1.2" xmlns="http://www.vdv.de/trias" xmlns:ns6="trias" xmlns:ns5="http://datex2.eu/schema/1_0/1_0" xmlns:ns2="http://www.siri.org.uk/siri" xmlns:ns4="http://www.ifopt.org.uk/ifopt" xmlns:ns3="http://www.ifopt.org.uk/acsb">
    <ServiceRequest>
        <ns2:RequestTimestamp>2022-01-19T17:40:00Z</ns2:RequestTimestamp>
        <ns2:RequestorRef>UWFFKQB7K6PH52MREGMB</ns2:RequestorRef>
        <RequestPayload>
            <StopEventRequest>
                <Location>
                    <LocationRef>
                        <StopPointRef>'. $stopPointRef .'</StopPointRef>
                    </LocationRef>
                    <DepArrTime>'. $deppArrTime .'</DepArrTime>
                </Location>
                <Params>
                    <NumberOfResults>2</NumberOfResults>
                    <StopEventType>departure</StopEventType>
                    <IncludePreviousCalls>false</IncludePreviousCalls>
                    <IncludeOnwardCalls>false</IncludeOnwardCalls>
                    <AlgorithmType>minChanges</AlgorithmType>
                </Params>
            </StopEventRequest>
        </RequestPayload>
    </ServiceRequest>
</Trias>';


//The URL that you want to send your XML to.
$url = 'https://v3-api.efa.de';

//Initiate cURL
$curl = curl_init($url);

//Set the Content-Type to text/xml.
curl_setopt ($curl, CURLOPT_HTTPHEADER, array("Content-Type: text/xml"));

//Set CURLOPT_POST to true to send a POST request.
curl_setopt($curl, CURLOPT_POST, true);

//Attach the XML string to the body of our request.
curl_setopt($curl, CURLOPT_POSTFIELDS, $xml);

//Tell cURL that we want the response to be returned as
//a string instead of being dumped to the output.
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

//Execute the POST request and send our XML.
$result = curl_exec($curl);

//Do some basic error checking.
if(curl_errno($curl))
{
    throw new Exception(curl_error($curl));
}

//Close the cURL handle.
curl_close($curl);

$dom = new DOMDocument;
$dom->preserveWhiteSpace = FALSE;
$dom->loadXML($result);

$dom->save($fileName);

echo $stop;
?>