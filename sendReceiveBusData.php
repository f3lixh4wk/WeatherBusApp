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


//Die URL an die wir unser XML senden wollen.
$url = 'https://v3-api.efa.de';

//Initialisiere cURL
$curl = curl_init($url);

//Setze den Content-Type zu text/xml.
curl_setopt ($curl, CURLOPT_HTTPHEADER, array("Content-Type: text/xml"));

//POST request auf true setzen.
curl_setopt($curl, CURLOPT_POST, true);

//Den XML String an den Body des Request hängen.
curl_setopt($curl, CURLOPT_POSTFIELDS, $xml);

//Wir möchten die Respone als String zurück haben.
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

//Ausführen des POST und sende des XML Strings.
$result = curl_exec($curl);

//Do some basic error checking.
if(curl_errno($curl))
{
    throw new Exception(curl_error($curl));
}

//Den cUrl Handle schließen.
curl_close($curl);

$dom = new DOMDocument;
$dom->preserveWhiteSpace = FALSE;
$dom->loadXML($result);

$dom->save($fileName);
?>